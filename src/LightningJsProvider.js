lightningjs.provide("argunet", {
    createArgunetBrowser: lightningjs.expensive(function(parameters) {
        return new argunet.ArgunetBrowser(parameters);
    })
});