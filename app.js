require('dotenv').config();
const LaunchDarkly = require('launchdarkly-node-server-sdk');

// Set sdkKey to your LaunchDarkly SDK key.
const sdkKey = process.env.LAUNCH_DARKLY_SDK_KEY;

// Set featureFlagKey to the feature flag key you want to evaluate.
const bodensteinUseGotModuleForHttpLDKey = process.env.BODENSTEIN_USE_GOT_FOR_HTTP_REQUEST_KEY;

function showMessage(s) {
    console.log("*** " + s);
    console.log("");
}

const ldClient = LaunchDarkly.init(sdkKey);

// Custom context for bodenstein
const contextWhereFlagIsEnabled = {
    kind: "ce-organisation-id",
    key: "Org-abcde"
};

const contextWhereFlagIsDisabled = {
    kind: "ce-organisation-id",
    key: "Org-random"
};

ldClient.waitForInitialization().then(async function () {
    showMessage("SDK successfully initialized!");

    // Testing this for positive context
    const flagValueForPositiveContext = await ldClient.variation(bodensteinUseGotModuleForHttpLDKey, contextWhereFlagIsEnabled, false);
    showMessage(`Feature flag '${bodensteinUseGotModuleForHttpLDKey}' is '${flagValueForPositiveContext}' for ${contextWhereFlagIsEnabled.key}`);

    // Testing this for negative context
    const flagValueForNegativeContext = await ldClient.variation(bodensteinUseGotModuleForHttpLDKey, contextWhereFlagIsDisabled, false);
    showMessage(`Feature flag '${bodensteinUseGotModuleForHttpLDKey}' is '${flagValueForNegativeContext}' for ${contextWhereFlagIsDisabled.key}`);

    // Close the ld client connection gracefully
    ldClient.flush(function () {
        ldClient.close();
    });
}).catch(function (error) {
    showMessage("SDK failed to initialize: " + error);
    process.exit(1);
});