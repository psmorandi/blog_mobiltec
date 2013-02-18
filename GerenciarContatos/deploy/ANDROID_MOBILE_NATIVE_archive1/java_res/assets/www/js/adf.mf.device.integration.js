/*
 *
 * ADF Mobile v1.0
 * 
 * http://www.oracle.com/technetwork/developer-tools/adf/overview/adf-mobile-096323.html
 * 
 * Copyright (c) 2011 Oracle.
 * All rights reserved. 
 * 
 */

try
{
    /* Helper code to resolve anonymous callback functions,

    If the function callback can be resolved by name it is returned unaltered.
    If the function is defined in an unknown scope and can't be resolved, an internal reference to the function is added to the internal map.

    Callbacks added to the map are one time use only, they will be deleted once called.  

    example 1:
    function myCallback(){};
    fString = GetFunctionName(myCallback);
    - result, the function is defined in the global scope, and will be returned as is because it can be resolved by name.

    example 2:
    fString = GetFunctionName(function(){};);
    - result, the function is defined in place, so it will be returned unchanged.

    example 3:
    function myMethod()
    {
        var funk = function(){};
        fString = GetFunctionName(funk);
    }
    - result, the function CANNOT be resolved by name, so an internal reference wrapper is created and returned.
    */

    var _anomFunkMap = {};
    var _anomFunkMapNextId = 0; 

    function anomToNameFunk(fun)
    {
      var funkId = "f" + _anomFunkMapNextId++;
      var funk = function()
      {
        fun.apply(this,arguments);
        _anomFunkMap[funkId] = null;
        delete _anomFunkMap[funkId];	
      }
      _anomFunkMap[funkId] = funk;

      return "_anomFunkMap." + funkId;
    }

    function GetFunctionName(fn)
    {
      if (fn) 
      {
          var m = fn.toString().match(/^\s*function\s+([^\s\(]+)/);
          return m ? m[1] : anomToNameFunk(fn);
      } else {
        return null;
      }
    }

    // Page level API 'namespace' objects - 'window' is the same as
    // using 'var adf;'...
    window.adf = window.adf || {};
    window.adf.mf = window.adf.mf || {};
    window.adf.mf.internal = window.adf.mf.internal || {};
    window.adf.mf.internal.di = window.adf.mf.internal.di || {};
    window.adf.mf.internal.di.api = window.adf.mf.internal.di.api || {};
    window.getAdfmfApiRoot = function()
    {
        return adf.mf.internal.di.api;
    }
    // Location for all the adf.pg functions is container.internal.device.integration
    window.container = window.container || {};
    window.container.internal = window.container.internal || {};
    window.container.internal.device = window.container.internal.device || {};
    window.container.internal.device.integration = window.container.internal.device.integration || {};
    window.containerInternalRoot = window.containerInternalRoot || function()
    {
        return container.internal.device.integration;
    }
    window.containerInternalRootDescription = window.containerInternalRootDescription || function()
    {
        return "container.internal.device.integration";
    }
    containerInternalRoot().__logDeprecation = true;
    containerInternalRoot()._logDeprecation = containerInternalRoot()._logDeprecation || function(fnName)
    {
        if(containerInternalRoot().__logDeprecation)
        {
            console.log("JavaScript API call '" + fnName + "(...)' has been deprecated.  Move your call from '" + 
                        adfmfDeprecatedRootDescription() + 
                        "' or 'navigator.ADFMobile' to '" + 
                        containerInternalRootDescription() + "'");
        }    
    }
    containerInternalRoot()._logRenamed = containerInternalRoot()._logRenamed || function(fnName, newFnName)
    {
      if(containerInternalRoot().__logDeprecation)
      {
        console.log("JavaScript API call '" + fnName + 
                    "(...)' has been deprecated.  Change your call to '" +
                    newFnName + "(...)'.");
      }    
    }
    containerInternalRoot()._logMovedToPublic = containerInternalRoot()._logMovedToPublic || function(fnName, pblName)
    {
        if(containerInternalRoot().__logDeprecation)
        {
            console.log("JavaScript API call '" + fnName + 
                        "(...)' has been deprecated.  Move your call to 'adf.mf.api." + 
                        pblName + "(...)'.");
        }    
    }
    containerInternalRoot()._logRemoved = containerInternalRoot()._logRemoved || function(fnName)
    {
        if(containerInternalRoot().__logDeprecation)
        {
            console.log("JavaScript API call '" + fnName + "(...)' has been removed.");
        }    
    }
    containerInternalRoot().getAdfmfPhoneGap = containerInternalRoot().getAdfmfPhoneGap || function ()
    {
        return PhoneGap;
    }
    
    // Deprecation Bridge for old APIs
    window.adfmf = window.adfmf || {};
    function adfmfDeprecatedRoot()
    {
        return adfmf;
    }
    function adfmfDeprecatedRootDescription()
    {
        return "adfmf";
    }

    // Deprecation Bridge 2 for old APIs
    window.container.internal.pg = window.container.internal.pg || {};
    function adfmfDeprecatedRoot2()
    {
        return container.internal.pg;
    }
    function adfmfDeprecatedRoot2Description()
    {
        return "container.internal.pg";
    }
    
    adfmfDeprecatedRoot().__buildAdfmfDeprecationBridge = adfmfDeprecatedRoot().__buildAdfmfDeprecationBridge || function()
    {
        var deprecatedRoot = adfmfDeprecatedRoot();
        var deprecatedRoot2 = adfmfDeprecatedRoot2();
        
        // Old APIs that no longer exist 
        deprecatedRoot.enableDebug = deprecatedRoot.enableDebug || function()
        {
            containerInternalRoot()._logRemoved("adfmf.enableDebug");
        }
        deprecatedRoot.disableDebug = deprecatedRoot.disableDebug || function()
        {
            containerInternalRoot()._logRemoved("adfmf.disableDebug");
        }
        deprecatedRoot.emailLog = deprecatedRoot.emailLog || function()
        {
            containerInternalRoot()._logRemoved("adfmf.emailLog");
        }
        
        // Bridge - Old namespace objects
        deprecatedRoot.Preferences = deprecatedRoot.Preferences || {};
        deprecatedRoot.Device = deprecatedRoot.Device || {};
        deprecatedRoot.Features = deprecatedRoot.Features || {};
        deprecatedRoot.Security = deprecatedRoot.Security || {};
        deprecatedRoot.Java = deprecatedRoot.Java || {};

        // Bridge 2 - Old namespace objects
        deprecatedRoot2.Preferences = deprecatedRoot2.Preferences || {};
        deprecatedRoot2.Device = deprecatedRoot2.Device || {};
        deprecatedRoot2.Features = deprecatedRoot2.Features || {};
        deprecatedRoot2.Security = deprecatedRoot2.Security || {};
        deprecatedRoot2.Java = deprecatedRoot2.Java || {};
        

        // Bridge 2 to internal root API now in container.internal.device.integration
        deprecatedRoot2.getAdfmfPhoneGap = deprecatedRoot2.getAdfmfPhoneGap || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".getAdfmfPhoneGap");
            containerInternalRoot().getAdfmfPhoneGap.apply(this,arguments);
        }
        

        // Bridge to internal root API now in container.internal.device.integration
        deprecatedRoot.getAmxIncludeList = deprecatedRoot.getAmxIncludeList || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".getAmxIncludeList");
            containerInternalRoot().getAmxIncludeList.apply(this,arguments);
        }
        
        // Bridge 2 to internal root API now in container.internal.device.integration
        deprecatedRoot2.getAmxIncludeList = deprecatedRoot2.getAmxIncludeList || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".getAmxIncludeList");
            containerInternalRoot().getAmxIncludeList.apply(this,arguments);
        }
        

        // Bridge to internal Preferences API now in container.internal.device.integration
        deprecatedRoot.Preferences.listPreferences = deprecatedRoot.Preferences.listPreferences || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Preferences.listPreferences");
            containerInternalRoot().Preferences.listPreferences.apply(this,arguments);
        }
        
        // Bridge 2 to internal Preferences API now in container.internal.device.integration
        deprecatedRoot2.Preferences.listPreferences = deprecatedRoot2.Preferences.listPreferences || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Preferences.listPreferences");
            containerInternalRoot().Preferences.listPreferences.apply(this,arguments);
        }
        

        // Bridge to internal Java API now in container.internal.device.integration
        deprecatedRoot.Java.invokeVMChannelCommand = deprecatedRoot.Java.invokeVMChannelCommand || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Java.invokeVMChannelCommand");
            containerInternalRoot().vmchannel.invoke.apply(this,arguments);
        }

        // Bridge 2 to internal Java API now in container.internal.device.integration
        deprecatedRoot2.Java.invokeVMChannelCommand = deprecatedRoot2.Java.invokeVMChannelCommand || function()
        {
            containerInternalRoot()._logRenamed(adfmfDeprecatedRoot2Description() + ".Java.invokeVMChannelCommand",
                                                containerInternalRootDescription() + ".vmchannel.invoke");
            containerInternalRoot().vmchannel.invoke.apply(this,arguments);
        }

        
        
        // Bridge to internal Security API now in container.internal.device.integration
        deprecatedRoot.Security.featureLogin = deprecatedRoot.Security.featureLogin || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Security.featureLogin");
            containerInternalRoot().Security.featureLogin.apply(this,arguments);
        }
        deprecatedRoot.Security.featureLogout = deprecatedRoot.Security.featureLogout || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Security.featureLogout");
            containerInternalRoot().Security.featureLogout.apply(this,arguments);
        }
        deprecatedRoot.Security.featureIsAuthenticated = deprecatedRoot.Security.featureIsAuthenticated || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Security.featureIsAuthenticated");
            containerInternalRoot().Security.featureIsAuthenticated.apply(this,arguments);
        }
        deprecatedRoot.Security.featureIsConnectionMultiTenantAware = deprecatedRoot.Security.featureIsConnectionMultiTenantAware || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Security.featureIsConnectionMultiTenantAware");
            containerInternalRoot().Security.featureIsConnectionMultiTenantAware.apply(this,arguments);
        }
        deprecatedRoot.Security.featureGetMultiTenantUsername = deprecatedRoot.Security.featureGetMultiTenantUsername || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Security.featureGetMultiTenantUsername");
            containerInternalRoot().Security.featureGetMultiTenantUsername.apply(this,arguments);
        }
        deprecatedRoot.Security.cancelLogin = deprecatedRoot.Security.cancelLogin || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Security.cancelLogin");
            containerInternalRoot().Security.cancelLogin.apply(this,arguments);
        }
        
        // Bridge 2 to internal Security API now in container.internal.device.integration
        deprecatedRoot2.Security.featureLogin = deprecatedRoot2.Security.featureLogin || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Security.featureLogin");
            containerInternalRoot().Security.featureLogin.apply(this,arguments);
        }
        deprecatedRoot2.Security.featureLogout = deprecatedRoot2.Security.featureLogout || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Security.featureLogout");
            containerInternalRoot().Security.featureLogout.apply(this,arguments);
        }
        deprecatedRoot2.Security.featureIsAuthenticated = deprecatedRoot2.Security.featureIsAuthenticated || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Security.featureIsAuthenticated");
            containerInternalRoot().Security.featureIsAuthenticated.apply(this,arguments);
        }
        deprecatedRoot2.Security.featureIsConnectionMultiTenantAware = deprecatedRoot2.Security.featureIsConnectionMultiTenantAware || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Security.featureIsConnectionMultiTenantAware");
            containerInternalRoot().Security.featureIsConnectionMultiTenantAware.apply(this,arguments);
        }
        deprecatedRoot2.Security.featureGetMultiTenantUsername = deprecatedRoot2.Security.featureGetMultiTenantUsername || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Security.featureGetMultiTenantUsername");
            containerInternalRoot().Security.featureGetMultiTenantUsername.apply(this,arguments);
        }
        deprecatedRoot2.Security.cancelLogin = deprecatedRoot2.Security.cancelLogin || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRoot2Description() + ".Security.cancelLogin");
            containerInternalRoot().Security.cancelLogin.apply(this,arguments);
        }
        
        
        
        // Bridge to internal Features API now in container.internal.device.integration
        deprecatedRoot.Features.listAvailable = deprecatedRoot.Features.listAvailable || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.listAvailable");
            containerInternalRoot().Features.listAvailable.apply(this,arguments);
        }
        deprecatedRoot.Features.registerActivationHandler = deprecatedRoot.Features.registerActivationHandler || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.registerActivationHandler");
            containerInternalRoot().Features.registerActivationHandler.apply(this,arguments);
        }
        deprecatedRoot.Features.showFeature = deprecatedRoot.Features.showFeature || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.showFeature");
            containerInternalRoot().Features.showFeature.apply(this,arguments);
        }
        deprecatedRoot.Features.getFeatureImage = deprecatedRoot.Features.getFeatureImage || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.getFeatureImage");
            containerInternalRoot().Features.getFeatureImage.apply(this,arguments);
        }
        deprecatedRoot.Features.showSpringboard = deprecatedRoot.Features.showSpringboard || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.showSpringboard");
            containerInternalRoot().Features.showSpringboard.apply(this,arguments);
        }
        deprecatedRoot.Features.showDefaultFeature = deprecatedRoot.Features.showDefaultFeature || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.showDefaultFeature");
            containerInternalRoot().Features.showDefaultFeature.apply(this,arguments);
        }
        deprecatedRoot.Features.showFeatureWithParameters = deprecatedRoot.Features.showFeatureWithParameters || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.showFeatureWithParameters");
            containerInternalRoot().Features.showFeatureWithParameters.apply(this,arguments);
        }
        deprecatedRoot.Features.resetFeature = deprecatedRoot.Features.resetFeature || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.resetFeature");
            containerInternalRoot().Features.resetFeature.apply(this,arguments);
        }
        deprecatedRoot.Features.hideNavigationBar = deprecatedRoot.Features.hideNavigationBar || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.hideNavigationBar");
            containerInternalRoot().Features.hideNavigationBar.apply(this,arguments);
        }
        deprecatedRoot.Features.showNavigationBar = deprecatedRoot.Features.showNavigationBar || function()
        {
            containerInternalRoot()._logDeprecation(adfmfDeprecatedRootDescription() + ".Features.showNavigationBar");
            containerInternalRoot().Features.showNavigationBar.apply(this,arguments);
        }
    }
    if(adfmfDeprecatedRoot().__buildAdfmfDeprecationBridge._wasCalled != true)
    {
        adfmfDeprecatedRoot().__buildAdfmfDeprecationBridge._wasCalled = true;
        adfmfDeprecatedRoot().__buildAdfmfDeprecationBridge();
    }
    
    /**
     * The 'adf.pg' varable is used to denote that we are running on a phonegap device and
     *        the user interface layer should act appropriately.
     */
    window.adf.pg = "RUNNING ON A PHONEGAP DEVICE";

    /**
     * This method is used by the springboard to notify the Native Framework that the
     * springboard has completed loading and the Native Framwork can do what it needs to
     * do after the springboard is loaded.
     */
    containerInternalRoot().springboardLoaded = function() 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec("ADFMobileShell.springboardLoaded");
    };
    
    /**
     * The method prompts the user to email out the log file.
     */
    containerInternalRoot().emailLog = function() 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, nul,  "ADFMobileShell", "emailLog", [ ]);
    };

    /**
     * The method to get the application level information like application name,
     * version and vendor.
     */
    containerInternalRoot().getAmxIncludeList = function(successCB, failureCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(successCB, failureCB, "ADFMobileShell", "getAmxIncludeList", [ ]);
    };

    /**
     * Represents the API for interacting with Preferences in the ADF Mobile Native Framework.
     */
    var ADFMobilePreferences = function() 
    {
        this.inProgress = false;
    };
    
    /**
     * The method to get all the available Preferences that were defined for the the 
     * ADF Mobile Native Framework along with their current values.
     */
    ADFMobilePreferences.prototype.listPreferences = function(successCB, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(successCB, errorCB, "ADFMobilePreferences", "listPreferences", []);
    };

    /**
     * Represents the API for interacting with features in the ADF Mobile Container.
     */
    var ADFMobileFeatures = function() 
    {
        this.inProgress = false;
        this.records = new Array();
    };

    /**
     * The method to get all the available features from the 
     * ADF Mobile Native Framework.
     */
    ADFMobileFeatures.prototype.listAvailable = function(successCB, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(successCB, errorCB, "ADFMobileFeatures", "listAvailable", []);
    };
    
    /**
     * The method to register a function as a handler for activation notices.
     */
    ADFMobileFeatures.prototype.registerActivationHandler = function(activationCB, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "registerActivationHandler", [ GetFunctionName(activationCB) ]);
    };
    
    /**
     * The method to show a feature in the ADF Mobile Native Framework.  This method
     * has an optional set of parameters
     */
    ADFMobileFeatures.prototype.showFeature = function(featureId, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "showFeature", [ featureId ]);
    };

    /**
     * The method to get a feature in the ADF Mobile Native Framework. The page will
     * be called back into and provided the image data for the feature.
     */
    ADFMobileFeatures.prototype.getFeatureImage = function(featureId, successCB, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(successCB, errorCB, "ADFMobileFeatures", "getFeatureImage", [ featureId ]);
    };
    
    /**
     * The method to show a feature in the ADF Mobile Native Framework.  This method
     * has an optional set of parameters
     */
    ADFMobileFeatures.prototype.showSpringboard = function(errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "showSpringboard", []);
    };

    /**
     * This method shows the default feature which is the feature that is normally 
     * displayed at application start.
     */
    ADFMobileFeatures.prototype.showDefaultFeature = function(errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "showDefaultFeature", []);
    };

    /**
     * The method to construct a feature parameter
     */
    this.FeatureParameter = function(name, value) 
    {
        this.name = name;
        this.value = value;
    }
    
    /**
     * The method to construct a set of features parameter.  This is 
     * provided as a convenience.  The user could provide any JavaScript
     * object as a parameter.
     */
    this.FeatureParameters = function() 
    {
        this.list = new Array();
    }
    
    /**
     * The method to add a new parameter to the set of parameters
     */
    this.FeatureParameters.prototype.addParameter = function(name, value) 
    {
        this.list.push(new FeatureParameter(name, value));
    }

    /**
     * The method to construct a java parameter
     */
    this.JavaParameter = function(name, value) 
    {
        this.name = name;
        this.value = value;
    }
    
    /**
     * The method to construct a set of java parameters.  This is 
     * provided as a convenience.  The user could provide any JavaScript
     * object as a parameter.
     */
    this.JavaParameters = function() 
    {
        this.list = new Array();
    }

    /**
     * The method to add a new parameter to the set of parameters
     */
    this.JavaParameters.prototype.addParameter = function(name, value) 
    {
        this.list.push(new JavaParameter(name, value));
    }

    /**
     * The method to show a feature in the ADF Mobile Native Framework.  This method
     * has a set of parameters that need to be delivered to the feature.
     */
    ADFMobileFeatures.prototype.showFeatureWithParameters = function(featureId, featureParameters, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "showFeatureWithParameters", [ featureId, featureParameters ]);
    };
    
    /**
     * The method to show a feature in the ADF Mobile Native Framework.  This method
     * has a set of parameters that need to be delivered to the feature.
     */
    ADFMobileFeatures.prototype.resetFeature = function(featureId, errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "resetFeature", [ featureId ]);
    };
    
    /**
     * The method to hide the Navigation Bar
     */
    ADFMobileFeatures.prototype.hideNavigationBar = function(errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "hideNavigationBar", []);
    };

    /**
     * The method to show the Navigation Bar
     */
    ADFMobileFeatures.prototype.showNavigationBar = function(errorCB) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, errorCB, "ADFMobileFeatures", "showNavigationBar", []);
    };

    /**
     * Represents the API for interacting with features in the ADF Mobile Security.
     */
    var ADFMobileSecurity = function() 
    {
    };
    
    /**
     * The method to authenticate user
     */
    ADFMobileSecurity.prototype.featureLogin = function(username, password, tenantname) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, null, "ADFMobileSecurity", "login", [ username, password, tenantname ]);
    };
    
    /**
     * The method to logout user
     */
    ADFMobileSecurity.prototype.featureLogout = function() 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, null, "ADFMobileSecurity", "logout", [  ]);
    };
    
    /**
     * The method to test user authentication
     */
    ADFMobileSecurity.prototype.featureIsAuthenticated = function() 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, null, "ADFMobileSecurity", "isAuthenticated", [  ]);
    };
    
    /**
     * The method to test if the feature is multi-tenent aware
     */
    ADFMobileSecurity.prototype.featureIsConnectionMultiTenantAware = function(callback) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(callback, null, "ADFMobileSecurity", "isConnectionMultiTenantAware", [ ]);
    };
    
    /**
     * The method to get multi-tenent aware user name
     */
    ADFMobileSecurity.prototype.featureGetMultiTenantUsername = function(callback) 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(callback, null, "ADFMobileSecurity", "getMultiTenantUsername", [ ]);
    };
    
    /**
     * The method to cancel login
     */
    ADFMobileSecurity.prototype.cancelLogin = function() 
    {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, null, "ADFMobileSecurity", "cancelLogin", [ ]);
    };
    
    /**
     * Represents the API for interacting with the CVM in the ADF Mobile Native Framework.
     */
    var ADFMobileJava = function() 
    {
        this.inProgress = false;
    };

// TODO do we still need this?
    /**
     * The method to invoke a method in java.
     */
    ADFMobileJava.prototype.invokeJavaWithParameters = function(method, parameters, successCB, errorCB) {
        // Actually pass the success callback to the 
        // JavaGapCommand because the JVM process async
        // and we may be sending more than one call back 
        // in at a time...We are only invoking one class 
        // type in the PhoneGapCommand for now - POC2
        containerInternalRoot().getAdfmfPhoneGap().exec(successCB,  errorCB, "JavaGapCommand", "invokeJava", [ parameters ]);
    };

    /**
     * The method to send a message into the VMChannel
     */
    ADFMobileJava.prototype.invoke = function(passedInMT, parameters, successCB, errorCB) 
    {     
        // Make sure we have only arrays
        var scb = successCB;
        if(typeof(scb) == "function") 
        {
            scb = [scb];
        }
        var ecb = errorCB;
        if(typeof(ecb) == "function") 
        {
            ecb = [ecb];
        }
        // Loop through and convert all function to strings
        for(var i = 0; i < scb.length; i++)
        {
            scb[i] = GetFunctionName(scb[i]);
            //alert("in scb["+i+"] = " + scb[i]);
        }
        for(var i = 0; i < ecb.length; i++)
        {
            ecb[i] = GetFunctionName(ecb[i]);
        }  
        
        var VMChannelCommand_Options = new Object();
        VMChannelCommand_Options.successCB = scb;
        VMChannelCommand_Options.errorCB = ecb;
        VMChannelCommand_Options.parameters = parameters;
        VMChannelCommand_Options.messageType = passedInMT;
        // Invoke the VMChannelCommand
        containerInternalRoot().getAdfmfPhoneGap().exec(null, null, "VMChannelCommand", "invokeJava", [ VMChannelCommand_Options ]);
    };

// TODO do we still need this?
    /**
     * The method to initialize the JVM.
     */
    ADFMobileJava.prototype.initializeJava = function() {
        containerInternalRoot().getAdfmfPhoneGap().exec(null, null, "JavaGapCommand", "initializeJava", []);
    };
    
    /**
     * Add the Features service to the ADFMobile
     */
    containerInternalRoot().Features = new ADFMobileFeatures();
    adf.mf.Features                  = containerInternalRoot().Features;
    /**
     * Add the vmchannel (formerly Java) service to the ADFMobile
     */
    containerInternalRoot().vmchannel = new ADFMobileJava();
    /**
     * Add the Preferences service to the ADFMobile
     */
    containerInternalRoot().Preferences = new ADFMobilePreferences();
    /**
     * Add the AdfMobileSecurity service to ADFMobile
     */
    containerInternalRoot().Security = new ADFMobileSecurity();

    /**
     * Add error methods
     */
    containerInternalRoot().errorShowingError = function() 
    {
        alert("There was an error trying to display an error.")
    }
    /*
     * Displays the error feature.  Sample error/exception object:
     * {name:"Error Title",message:"The error message that should be displayed to the user."}
     */
    containerInternalRoot().gotoError = function(e) 
    {
        adfmfDeprecatedRoot().Features.showFeatureWithParameters("_Oracle_Default_Error_Feature_Id_", e, adfmf.errorShowingError);
    };
    
    /**
     * Add the ADFMobile constructor to the list of constructors processed at load time 
     * by PhoneGap.  PhoneGap ensures no race conditions exist by waiting for load and 
     * running all constructors at once and then dispating the 'deviceready' event.
     */
    function __ADFMobile_internal_PhoneGap_Constructor()
    {
        // For now allow the use of the "adfmf" object through the 
        // old navigator.ADFMobile accessor.  We now point at the
        // deprecated root to make sure we notify others that the
        // API has moved.
        if (typeof navigator.ADFMobile == "undefined") navigator.ADFMobile = adfmfDeprecatedRoot();
        
        // specific to Android
        PhoneGap.addPlugin("ADFMobileShell", containerInternalRoot());
        PhoneGap.addPlugin("ADFMobilePreferences", containerInternalRoot().Preferences);
        PhoneGap.addPlugin("ADFMobileFeatures", containerInternalRoot().Features);
// TODO - do we need this?
        PhoneGap.addPlugin("JavaGapCommand", containerInternalRoot().Java);
        PhoneGap.addPlugin("VMChannelCommand", containerInternalRoot().Java);
        PhoneGap.addPlugin("ADFMobileSecurity", containerInternalRoot().Security);
    }
    containerInternalRoot().getAdfmfPhoneGap().addConstructor(__ADFMobile_internal_PhoneGap_Constructor);
}
catch(e)
{
    console.log("**************************************************");
    console.log("***** ERROR: adf.mf.device.integration.js buildout error: " + e);
}

