/**
 * Модуль "Эквивалайзер".
 * @module Equalizer
 */
modules.define('Equalizer', [], function (provide) {
    /**
     * @name Equalizer
     * @param {HTMLElement|String} holder Элемент, внутри которого будет находится эквивалайзер.
     * @param {Object} options
     * @param {Number} [options.count=2] Количество полосок в эквивалайзере.
     * @param {Number} [options.repaint=50] Интервал между перерисовками эквивалайзера.
     * @param {Number} [options.timeout=2*options.repaint] Период колебаний.
     */
    var Equalizer = function (holder, options) {
        this._holder = holder instanceof HTMLElement ? holder : document.getElementById(holder);

        this._options = {};
        this._options.height = this._holder.clientHeight;
        this._options.count = options.count || 2;

        // Как часто будет происходить перерисовка.
        this._options.repaint = options.repaint || 50;
        if (options.timeout < 2 * this._options.repaint) {
            this._options.timeout = 2 * this._options.repaint;
        } else {
            this._options.timeout = options.timeout;
        }

        this._columns = [];

        // Создаем полоски эквивалайзера в фрагменете, который не привязан к текущему DOM,
        // чтобы не перерисовывать страницу при добавлении каждой полоски.
        var domEqualizer = document.createDocumentFragment();
        var widthOfColumn = this._holder.clientWidth / this._options.count;

        for (var i = 0; i < this._options.count + 1; i++) {
            this._columns[i] = {
                node: document.createElement('span'),
                limit: 0.5 * this._options.height,
                current: 0.5 * this._options.height,
                step: 1
            };

            this._columns[i].node.className = 'equalizer-column';
            this._columns[i].node.style.width = widthOfColumn + 'px';

            domEqualizer.appendChild(this._columns[i].node);
        }
        this._holder.appendChild(domEqualizer);
    };

    /**
     * @public
     * @function start
     * @description Запускает работу эквивалайзера.
     *
     * @returns {Equalizer}
     */
    Equalizer.prototype.start = function () {
        this._interval = setInterval(this._repaint.bind(this), this._options.repaint);
        return this;
    };

    /**
     * @public
     * @function stop
     * @description Останавливает работу эквивалайзера.
     *
     * @returns {Equalizer}
     */
    Equalizer.prototype.stop = function () {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = 0;
        }
        return this;
    };

    /**
     * @public
     * @function destroy
     * @description Уничтожает внутренние данные. GC медленно очищает сложные объекты, поэтому лучше делать это явно. 
     */
    Equalizer.prototype.destroy = function () {
        this.stop();

        this._columns = [];
        this._holder.innerHTML = '';
    };

    Equalizer.prototype._repaint = function () {
        var isPhaseChanged = false;
        var column = this._columns[0];
        if (column.step >= 0 && column.current >= column.limit || column.step < 0 && column.current <= column.limit) {
            this._phase = !this._phase;
            isPhaseChanged = true;
        }
        for (var i = 0, length = this._columns.length; i < length; i++) {
            if (isPhaseChanged) {
                this._columns[i].limit = (this._phase ? Math.random() : 0.5) * this._options.height;

                var diff = this._columns[i].limit - this._columns[i].current;
                this._columns[i].step = 2 * diff * this._options.repaint / this._options.timeout;
            }
            this._columns[i].current += this._columns[i].step;
            this._columns[i].node.style.top = this._columns[i].current + 'px';
        }
        return this;
    };

    provide(Equalizer);
});