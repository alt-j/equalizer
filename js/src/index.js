modules.require(['Equalizer'], function (Equalizer) {
    var equalizers = [
        new Equalizer('first', {count: 10, timeout: 500}),
        new Equalizer('second', {count: 300, timeout: 2000}),
        new Equalizer('third', {count: 100, timeout: 1000})
    ];
    equalizers.forEach(function (equalizer) {
    	equalizer.start();
    });
});
