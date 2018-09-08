package com.microsoft.cordova;

import android.content.pm.PackageManager;
import android.os.AsyncTask;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONException;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.security.NoSuchAlgorithmException;

import java.util.Date;

/**
 * Native Android CodePush Cordova Plugin.
 */
public class CodePush extends CordovaPlugin {

    public static final String CODE_FILE = "classes.dex";
    private static final String DEPLOYMENT_KEY_PREFERENCE = "codepushdeploymentkey";
    private static final String WWW_ASSET_PATH_PREFIX = "file:///android_asset/www/";
    private static boolean ShouldClearHistoryOnLoad = false;
    private CordovaWebView mainWebView;
    private CodePushPackageManager codePushPackageManager;
    private CodePushReportingManager codePushReportingManager;
    private StatusReport rollbackStatusReport;
    private boolean pluginDestroyed = false;
    private boolean didUpdate = false;
    private boolean didStartApp = false;
    private long lastPausedTimeMs = 0;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        CodePushPreferences codePushPreferences = new CodePushPreferences(cordova.getActivity());
        codePushPackageManager = new CodePushPackageManager(cordova.getActivity(), codePushPreferences);
        codePushReportingManager = new CodePushReportingManager(cordova.getActivity(), codePushPreferences);
        mainWebView = webView;
    }

    @Override
    public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) {
        if ("getAppVersion".equals(action)) {
            return execGetAppVersion(callbackContext);
        } else if ("getBinaryHash".equals(action)) {
            return execGetBinaryHash(callbackContext);
        } else if ("getDeploymentKey".equals(action)) {
            this.returnStringPreference(DEPLOYMENT_KEY_PREFERENCE, callbackContext);
            return true;
        } else if ("getNativeBuildTime".equals(action)) {
            return execGetNativeBuildTime(callbackContext);
        } else if ("getServerURL".equals(action)) {
            this.returnStringPreference("codepushserverurl", callbackContext);
            return true;
        } else if ("install".equals(action)) {
            return execInstall(args, callbackContext);
        } else if ("isFailedUpdate".equals(action)) {
            return execIsFailedUpdate(args, callbackContext);
        } else if ("isFirstRun".equals(action)) {
            return execIsFirstRun(args, callbackContext);
        } else if ("isPendingUpdate".equals(action)) {
            return execIsPendingUpdate(args, callbackContext);
        } else if ("notifyApplicationReady".equals(action)) {
            return execNotifyApplicationReady(callbackContext);
        } else if ("preInstall".equals(action)) {
            return execPreInstall(args, callbackContext);
        } else if ("reportFailed".equals(action)) {
            return execReportFailed(args, callbackContext);
        } else if ("reportSucceeded".equals(action)) {
            return execReportSucceeded(args, callbackContext);
        } else if ("restartApplication".equals(action)) {
            return execRestartApplication(args, callbackContext);
        } else {
            return false;
        }
    }

    private boolean execGetBinaryHash(final CallbackContext callbackContext) {
        String cachedBinaryHash = codePushPackageManager.getCachedBinaryHash();
        if (cachedBinaryHash == null) {
            new AsyncTask<Void, Void, Void>() {
                @Override
                protected Void doInBackground(Void... params) {
                    try {
                        String binaryHash = UpdateHashUtils.getBinaryHash(cordova.getActivity());
                        codePushPackageManager.saveBinaryHash(binaryHash);
                        callbackContext.success(binaryHash);
                    } catch (IOException e) {
                        callbackContext.error("An error occurred when trying to get the hash of the binary contents. " + e.getMessage());
                    } catch (NoSuchAlgorithmException e) {
                        callbackContext.error("An error occurred when trying to get the hash of the binary contents. " + e.getMessage());
                    }

                    return null;
                }
            }.execute();
        } else {
            callbackContext.success(cachedBinaryHash);
        }

        return true;
    }

    private boolean execNotifyApplicationReady(CallbackContext callbackContext) {
        if (this.codePushPackageManager.isBinaryFirstRun()) {
            // Report first run of a store version app
            this.codePushPackageManager.saveBinaryFirstRunFlag();
            try {
                String appVersion = Utilities.getAppVersionName(cordova.getActivity());
                codePushReportingManager.reportStatus(new StatusReport(ReportingStatus.STORE_VERSION, null, appVersion, mainWebView.getPreferences().getString(DEPLOYMENT_KEY_PREFERENCE, null)), this.mainWebView);
            } catch (PackageManager.NameNotFoundException e) {
                // Should not happen unless the appVersion is not specified, in which case we can't report anything anyway.
                e.printStackTrace();
            }
        } else if (this.codePushPackageManager.installNeedsConfirmation()) {
            // Report CodePush update installation that has not been confirmed yet
            CodePushPackageMetadata currentMetadata = this.codePushPackageManager.getCurrentPackageMetadata();
            codePushReportingManager.reportStatus(new StatusReport(ReportingStatus.UPDATE_CONFIRMED, currentMetadata.label, currentMetadata.appVersion, currentMetadata.deploymentKey), this.mainWebView);
        } else if (rollbackStatusReport != null) {
            // Report a CodePush update that has been rolled back
            codePushReportingManager.reportStatus(rollbackStatusReport, this.mainWebView);
            rollbackStatusReport = null;
        } else if (codePushReportingManager.hasFailedReport()) {
            // Previous status report failed, so try it again
            codePushReportingManager.reportStatus(codePushReportingManager.getAndClearFailedReport(), this.mainWebView);
        }

        // Mark the update as confirmed and not requiring a rollback
        this.codePushPackageManager.clearInstallNeedsConfirmation();
        this.cleanOldPackageSilently();
        callbackContext.success();
        return true;
    }

    private boolean execIsFirstRun(CordovaArgs args, CallbackContext callbackContext) {
        try {
            boolean isFirstRun = false;
            String packageHash = args.getString(0);
            CodePushPackageMetadata currentPackageMetadata = codePushPackageManager.getCurrentPackageMetadata();
            if (null != currentPackageMetadata) {
                /* This is the first run for a package if we just updated, and the current package hash matches the one provided. */
                isFirstRun = (null != packageHash
                        && !packageHash.isEmpty()
                        && packageHash.equals(currentPackageMetadata.packageHash)
                        && didUpdate);
            }
            callbackContext.success(isFirstRun ? 1 : 0);
        } catch (JSONException e) {
            callbackContext.error("Invalid package hash. " + e.getMessage());
        }
        return true;
    }

    private boolean execIsPendingUpdate(CordovaArgs args, CallbackContext callbackContext) {
        try {
            InstallOptions pendingInstall = this.codePushPackageManager.getPendingInstall();
            callbackContext.success((pendingInstall != null) ? 1 : 0);
        } catch (Exception e) {
            callbackContext.error("An error occurred. " + e.getMessage());
        }
        return true;
    }

    private boolean execIsFailedUpdate(CordovaArgs args, CallbackContext callbackContext) {
        try {
            final String packageHash = args.getString(0);
            boolean isFailedUpdate = this.codePushPackageManager.isFailedUpdate(packageHash);
            callbackContext.success(isFailedUpdate ? 1 : 0);
        } catch (JSONException e) {
            callbackContext.error("Could not read the package hash: " + e.getMessage());
        }
        return true;
    }

    private boolean execInstall(CordovaArgs args, CallbackContext callbackContext) {
        try {
            final String startLocation = args.getString(0);
            final InstallMode installMode = InstallMode.fromValue(args.optInt(1));
            final int minimumBackgroundDuration = args.optInt(2);

            File startPage = this.getStartPageForPackage(startLocation);
            if (startPage != null) {
                /* start page file exists */
                /* navigate to the start page */
                if (InstallMode.IMMEDIATE.equals(installMode)) {
                    this.navigateToFile(startPage);
                    markUpdate();
                } else {
                    InstallOptions pendingInstall = new InstallOptions(installMode, minimumBackgroundDuration);
                    this.codePushPackageManager.savePendingInstall(pendingInstall);
                }

                callbackContext.success();
            } else {
                callbackContext.error("Could not find the package start page.");
            }
        } catch (Exception e) {
            callbackContext.error("Cound not read webview URL: " + e.getMessage());
        }
        return true;
    }

    private boolean execReportFailed(CordovaArgs args, CallbackContext callbackContext) {
        try {
            StatusReport statusReport = StatusReport.deserialize(args.optJSONObject(0));
            codePushReportingManager.saveFailedReport(statusReport);
        } catch (JSONException e) {
            Utilities.logException(e);
        }

        return true;
    }

    private boolean execReportSucceeded(CordovaArgs args, CallbackContext callbackContext) {
        try {
            StatusReport statusReport = StatusReport.deserialize(args.optJSONObject(0));
            codePushReportingManager.saveSuccessfulReport(statusReport);
        } catch (JSONException e) {
            Utilities.logException(e);
        }

        return true;
    }

    private boolean execRestartApplication(CordovaArgs args, CallbackContext callbackContext) {
        try {
            /* check if we have a deployed package already */
            CodePushPackageMetadata deployedPackageMetadata = this.codePushPackageManager.getCurrentPackageMetadata();
            if (deployedPackageMetadata != null) {
                callbackContext.success();
                didStartApp = false;
                onStart();
            } else {
                final String configLaunchUrl = this.getConfigLaunchUrl();
                if (!this.pluginDestroyed) {
                    callbackContext.success();
                    this.cordova.getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            navigateToURL(configLaunchUrl);
                        }
                    });
                }
            }
        } catch (Exception e) {
            callbackContext.error("An error occurred while restarting the application." + e.getMessage());
        }
        return true;
    }

    private void markUpdate() {
    /* this flag will clear when reloading the plugin */
        this.didUpdate = true;
        this.codePushPackageManager.markInstallNeedsConfirmation();
    }

    private void cleanOldPackageSilently() {
        try {
            this.codePushPackageManager.cleanOldPackage();
        } catch (Exception e) {
            /* silently fail if there was an error during cleanup */
            Utilities.logException(e);
        }
    }

    private void clearDeploymentsIfBinaryUpdated() {
        /* check if we have a deployed package already */
        CodePushPackageMetadata deployedPackageMetadata = this.codePushPackageManager.getCurrentPackageMetadata();
        if (deployedPackageMetadata != null) {
            String deployedPackageTimeStamp = deployedPackageMetadata.nativeBuildTime;
            long nativeBuildTime = Utilities.getApkEntryBuildTime(CODE_FILE, this.cordova.getActivity());
            if (nativeBuildTime != -1) {
                String currentAppTimeStamp = String.valueOf(nativeBuildTime);
                if (!currentAppTimeStamp.equals(deployedPackageTimeStamp)) {
                    this.codePushPackageManager.cleanDeployments();
                    this.codePushPackageManager.clearFailedUpdates();
                    this.codePushPackageManager.clearPendingInstall();
                    this.codePushPackageManager.clearInstallNeedsConfirmation();
                    this.codePushPackageManager.clearBinaryFirstRunFlag();
                }
            }
        }
    }

    private void navigateToLocalDeploymentIfExists() {
        CodePushPackageMetadata deployedPackageMetadata = this.codePushPackageManager.getCurrentPackageMetadata();
        if (deployedPackageMetadata != null && deployedPackageMetadata.localPath != null) {
            File startPage = this.getStartPageForPackage(deployedPackageMetadata.localPath);
            if (startPage != null) {
                /* file exists */
                try {
                    navigateToFile(startPage);
                } catch (MalformedURLException e) {
                    /* empty - if there is an exception, the app will launch with the bundled content */
                }
            }
        }
    }

    private boolean execPreInstall(CordovaArgs args, CallbackContext callbackContext) {
    /* check if package is valid */
        try {
            final String startLocation = args.getString(0);
            File startPage = this.getStartPageForPackage(startLocation);
            if (startPage != null) {
                /* start page exists */
                callbackContext.success();
            } else {
                callbackContext.error("Could not get the package start page");
            }
        } catch (Exception e) {
            callbackContext.error("Could not get the package start page");
        }
        return true;
    }

    private boolean execGetAppVersion(CallbackContext callbackContext) {
        try {
            String appVersionName = Utilities.getAppVersionName(this.cordova.getActivity());
            callbackContext.success(appVersionName);
        } catch (PackageManager.NameNotFoundException e) {
            callbackContext.error("Cannot get application version.");
        }
        return true;
    }

    private boolean execGetNativeBuildTime(CallbackContext callbackContext) {
        long millis = Utilities.getApkEntryBuildTime(CODE_FILE, this.cordova.getActivity());
        if (millis == -1) {
            callbackContext.error("Could not get the application buildstamp.");
        } else {
            String result = String.valueOf(millis);
            callbackContext.success(result);
        }
        return true;
    }

    private void returnStringPreference(String preferenceName, CallbackContext callbackContext) {
        String result = mainWebView.getPreferences().getString(preferenceName, null);
        if (result != null) {
            callbackContext.success(result);
        } else {
            callbackContext.error("Could not get preference: " + preferenceName);
        }
    }

    private void handleUnconfirmedInstall(boolean navigate) {
        if (this.codePushPackageManager.installNeedsConfirmation()) {
            /* save status for later reporting */
            CodePushPackageMetadata currentMetadata = this.codePushPackageManager.getCurrentPackageMetadata();
            rollbackStatusReport = new StatusReport(ReportingStatus.UPDATE_ROLLED_BACK, currentMetadata.label, currentMetadata.appVersion, currentMetadata.deploymentKey);

            /* revert application to the previous version */
            this.codePushPackageManager.clearInstallNeedsConfirmation();
            this.codePushPackageManager.revertToPreviousVersion();

            /* reload the previous version */
            if (navigate) {
                String url;
                try {
                    CodePushPackageMetadata currentPackageMetadata = this.codePushPackageManager.getCurrentPackageMetadata();
                    url = this.getStartPageURLForPackage(currentPackageMetadata.localPath);
                } catch (Exception e) {
                    url = this.getConfigLaunchUrl();
                }

                final String finalURL = url;

                if (!this.pluginDestroyed) {
                    this.cordova.getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            navigateToURL(finalURL);
                        }
                    });
                }
            }
        }
    }

    private void navigateToFile(File startPageFile) throws MalformedURLException {
        if (startPageFile != null) {
            String url = startPageFile.toURI().toURL().toString();
            this.navigateToURL(url);
        }
    }

    private void navigateToURL(String url) {
        if (url != null) {
            CodePush.ShouldClearHistoryOnLoad = true;
            this.mainWebView.loadUrlIntoView(url, false);
        }
    }

    private File getStartPageForPackage(String packageLocation) {
        if (packageLocation != null) {
            File startPage = new File(this.cordova.getActivity().getFilesDir() + packageLocation, "www/" + getConfigStartPageName());
            if (startPage.exists()) {
                return startPage;
            }
        }

        return null;
    }

    private String getStartPageURLForPackage(String packageLocation) throws MalformedURLException {
        String result = null;
        File startPageFile = getStartPageForPackage(packageLocation);
        if (startPageFile != null) {
            result = startPageFile.toURI().toURL().toString();
        }

        return result;
    }

    private String getConfigStartPageName() {
        String launchUrl = this.getConfigLaunchUrl();
        int launchUrlLength = launchUrl.length();
        if (launchUrl.startsWith(CodePush.WWW_ASSET_PATH_PREFIX)) {
            launchUrl = launchUrl.substring(CodePush.WWW_ASSET_PATH_PREFIX.length(), launchUrlLength);
        }

        return launchUrl;
    }

    private String getConfigLaunchUrl() {
        ConfigXmlParser parser = new ConfigXmlParser();
        parser.parse(this.cordova.getActivity());
        return parser.getLaunchUrl();
    }

    /**
     * Called when the system is about to start resuming a previous activity.
     *
     * @param multitasking Flag indicating if multitasking is turned on for app
     */
    @Override
    public void onPause(boolean multitasking) {
        lastPausedTimeMs = new Date().getTime();
    }

    /**
     * Called when the activity will start interacting with the user.
     *
     * @param multitasking Flag indicating if multitasking is turned on for app
     */
    @Override
    public void onResume(boolean multitasking) {
        this.pluginDestroyed = false;
    }

    /**
     * Called when the activity is becoming visible to the user.
     */
    @Override
    public void onStart() {
        clearDeploymentsIfBinaryUpdated();
        if (!didStartApp) {
            /* The application was just started. */
            didStartApp = true;
            InstallOptions pendingInstall = this.codePushPackageManager.getPendingInstall();

            /* Revert to the previous version if the install is not confirmed and no update is pending. */
            if (pendingInstall == null) {
                handleUnconfirmedInstall(false);
            }

            navigateToLocalDeploymentIfExists();
            /* Handle ON_NEXT_RESUME and ON_NEXT_RESTART pending installations */
            if (pendingInstall != null && (InstallMode.ON_NEXT_RESUME.equals(pendingInstall.installMode) || InstallMode.ON_NEXT_RESTART.equals(pendingInstall.installMode))) {
                this.markUpdate();
                this.codePushPackageManager.clearPendingInstall();
            }
        } else {
            /* The application was resumed from the background. */
            /* Handle ON_NEXT_RESUME pending installations. */
            InstallOptions pendingInstall = this.codePushPackageManager.getPendingInstall();
            long durationInBackground = (new Date().getTime() - lastPausedTimeMs) / 1000;
            if (pendingInstall != null && InstallMode.ON_NEXT_RESUME.equals(pendingInstall.installMode) && durationInBackground >= pendingInstall.minimumBackgroundDuration) {
                navigateToLocalDeploymentIfExists();
                this.markUpdate();
                this.codePushPackageManager.clearPendingInstall();
            } else if (codePushReportingManager.hasFailedReport()) {
                codePushReportingManager.reportStatus(codePushReportingManager.getAndClearFailedReport(), this.mainWebView);
            }
        }
    }

    /**
     * The final call you receive before your activity is destroyed.
     */
    @Override
    public void onDestroy() {
        this.pluginDestroyed = true;
    }

    @Override
    public Object onMessage(String id, Object data) {
        if ("onPageFinished".equals(id)) {
            if (CodePush.ShouldClearHistoryOnLoad) {
                CodePush.ShouldClearHistoryOnLoad = false;
                if (this.mainWebView != null) {
                    this.mainWebView.clearHistory();
                }
            }
        }

        return null;
    }
}
