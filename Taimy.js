/**
* Clase que ejecuta funciones en un lapzo de tiempo determinado de forma mas segura
* @class
*/
class Taimy {
    #bucle; #duracion; #tiempoInicial = 0; #tiempoTr = 0; #fn; #intervalo = 0; #espera; #stout; #ejecucion = 0;
/**
* Constructor opcional
* @constructor Para mas detalles [visitame en github](https://github.com/NekoShooter/Taimy)
* @param {function} [fn] - Funcion a ejecutarse, puede aceptar un *cronometro* como parametro: *`cronometro => { codigo }`*
* @param {Object} [dataTiempo] - El objeto debe contener como minimo la propiedad: __*intervalo*__ o __*espera*__
* @param {number|undefined} dataTiempo.intervalo - Lapso de tiempo que toma en ejecutarse la funcion
* @param {number|undefined} dataTiempo.duracion - Duracion `number: Finita` o `undefined: Infinita`
* @param {number|undefined} dataTiempo.espera - Tiempo que demorara en comenzar a ejecutarse
*/
    constructor(fn = undefined, dataTiempo = undefined){
        this.nuevo(fn,dataTiempo);
        this.reiniciar = this.reiniciar.bind(this);
        this.detener = this.detener.bind(this);
        this.arrancar = this.arrancar.bind(this);
        this.interruptor = this.interruptor.bind(this);
        this.destructor = this.destructor.bind(this);}
/**
 * Cambia el atributo funcion
 * @param {function} fn Puede aceptar un *cronometro* como parametro: *`cronometro => { codigo }`*
 */
    set funcion(fn){ 
        if(typeof(fn) != 'function') throw('el parametro fn debe ser una funcion');
        this.#fn = fn;}

/**
 * Devuelve el atributo funcion
 * @return {function} funcion almacenada
 */
    get funcion(){return this.#fn;}
/** 
 * Devuelve el estado actual de la ejecucion
 * @returns {boolean} devuelve __`true`__ si se encuentra actualmente en ejecucion
 */
    get estaActivo(){ return !!this.#bucle || !!this.#stout;}
/**
 * Devuelve la duracion
 * @returns {number} devuelve la duracion en milisegundos o undefined si la duracion es infinita
 */
    get duracion(){return this.#duracion}
/**
 * Cambia el atributo duracion
 * @param {number|undefined} ms - Duracion `number: Finita` en milisegundos o `undefined: Infinita`
 */
    set duracion(ms){this.cambiarDuracion(ms)}

/**
 * Devuelve el intervalo de tiempo
 * @returns {number|undefined} devuelve el intervalo de tiempo en milisegundos o undefined si no esta definida
 */
    get intervalo(){return this.#intervalo ?? 0;}
/**
 * Cambia el intervalo de tiempo
 * @param {number|undefined} ms Intervalo de tiempo en milisegundos o undefined si no quiere definir
 */
    set intervalo(ms){this.cambiarIntervalo(ms);}
/**
 * Devuelve el tiempo en el que demorara la funcion a comenzar a ejecurtarse
 * @param {number|undefined} ms Retardo de tiempo en milisegundos o undefined si no esta definida
 */
    get espera(){return this.#espera;}
/**
 * Cambia el tiempo en el que demorara la funcion a comenzar a ejecurtarse
 * @param {number|undefined} ms Retardo de tiempo en milisegundos o undefined si no quiere definir
 */
    set espera(ms){this.cambiarEspera(ms);}

/**
* Cambia la duracion de la ejecucion tanto si se encuentra en ejecucion como no
* @param {number|undefined} [ms] - Tiempo en milisegundo, si es undefined que no hay tiempo establecido
*/
    cambiarDuracion(ms){
        if(typeof(ms) == 'number'){
            const t = ms | 0;
            if(t <= 0 || t == this.#duracion) return;
            if(t <= this.cronometro()) this.#puntoInicio();
            this.#duracion = t;}
        else if(ms === undefined) this.#duracion = undefined;}

/**
* Cambia el lapso de tiempo que toma ejecutarse, se actualiza si esta en ejecucion
* @param {number|undefined} [ms] - Tiempo en milisegundo, si es undefined indicara que no hay tiempo establecido
*/
    cambiarIntervalo(ms){
        if(typeof(ms) == 'number' && (ms | 0) != this.#intervalo && (ms | 0) > 0){
            this.#intervalo = ms | 0;
            this.#reEjecutarStint();}
        else if(ms === undefined) {
            this.detener();
            this.#intervalo = undefined;}}
/**
* Cambia el tiempo en el que comenzara a ejecutarse, no se vera actualizada asta que esta se reinicie
* @param {number|undefined} [ms] - Tiempo en milisegundo, si es undefined indicara que no hay tiempo establecido
*/
    cambiarEspera(ms){
        if(typeof(ms) != 'number' || (ms | 0) == this.#espera) return;
        this.#reEjecutarStout((ms | 0));}

    #reEjecutarStint(){
        if(!this.#bucle) return;
        this.detener();
        this.arrancar();}

    #reEjecutarStout(ms){
        if(this.#stout || this.#ejecucion == 1){
            const tiempoRestante = ms - this.#tiempoEjecucion();
            this.#puntoInicio();
            this.#espera = tiempoRestante < 0 ? undefined : tiempoRestante;
            this.arrancar();}
        this.#espera = ms;}
/**
* Comienza una nueva ejecucion si exite una previa la detiene
* @param {function} [fn] - Funcion a ejecutarse, puede aceptar un *cronometro* como parametro: *`cronometro => { codigo }`*
* @param {Object} [dataTiempo] - El objeto debe contener como minimo la propiedad: __*intervalo*__ o __*espera*__
* @param {number|undefined} dataTiempo.intervalo - Lapso de tiempo que toma en ejecutarse la funcion
* @param {number|undefined} dataTiempo.duracion - Duracion `number: Finita` o `undefined: Infinita`
* @param {number|undefined} dataTiempo.espera - Tiempo que demorara en comenzar a ejecutarse
*/
    nuevo(fn,dataTiempo){
        if(!fn && !dataTiempo) return;
        this.destructor();
        try{
            this.funcion = fn;
            const {intervalo,duracion,espera} = dataTiempo;
            if(!intervalo && !duracion && !espera) throw('el objeto dataTiempo debe contener almenos el intervalo');
            this.cambiarDuracion(duracion);
            this.cambiarIntervalo(intervalo);
            this.cambiarEspera(espera);}
        catch(error){
            console.error("el Parametro de tiempo es incorrecto", error);
            return error;}}

    #limpiarBucle(){
        if(!this.estaActivo) return;
        if(this.#bucle) clearInterval(this.#bucle);
        if(this.#stout) clearTimeout(this.#stout);
        this.#stout = this.#bucle = undefined;}

    #puntoInicio(){
        this.#ejecucion = this.#tiempoTr = this.#tiempoInicial = 0;
        this.#limpiarBucle();}

/**
 * Funcion que reinicia la ejecucion desde el comienzo
 */
    reiniciar(){
        if(!this.#fn) return;
        this.#ejecucionActual();
        if(this.#ejecucion == 2 || this.#tiempoTr){
            this.#puntoInicio();
            this.#refuncion();}}
/**
 * Funcion que reinicia la ejecucion desde el comienzo incluyendo el tiempo de espera
 */        
    reinicioTotal(){
        this.#puntoInicio();
        this.arrancar();}
/**
 * Funcion que detiene la ejecucion para ser reanudada en algun otro punto;
 */
    detener(){
        if(!this.estaActivo) return;
        this.#ejecucionActual();
        this.#limpiarBucle();}
        
    #ejecucionActual(){
        this.#tiempoTr = this.#tiempoEjecucion();
        this.#ejecucion = this.#stout ? 1 : (this.#bucle ? 2 : 0);}

    #refuncion(){
        if(this.#stout) clearTimeout(this.#stout);
        this.#stout = undefined;
        this.#tiempoInicial = Date.now();
        const funcion = ()=>{
            const crono = this.#tiempoEjecucion();
            this.#fn(crono);
            if(this.#duracion && this.#duracion <= crono) this.#puntoInicio();}
        this.#fn(this.#tiempoTr);
        this.#bucle = setInterval(funcion,this.#intervalo);}
/**
 * Funcion que comienza la ejecucion o la continua segun sea el caso
 */
    arrancar(){
        if(this.estaActivo || !this.#fn) return;
        this.#tiempoInicial = Date.now();
        const tiempo = (this.#espera ?? 0) - this.#tiempoTr;
        if(this.#ejecucion == 1 && tiempo < 0) return;

        if(this.#espera != undefined && (!this.#duracion && !this.#intervalo) && this.#ejecucion != 2){
            if (this.#espera < 1) this.#fn(0);
            else
                this.#stout = setTimeout(()=>{
                    if(this.#stout) clearTimeout(this.#stout);
                    this.#stout = undefined;
                    this.#tiempoInicial = Date.now();
                    this.#fn(0);
                },tiempo);}
            
        else if(this.#espera != undefined && (this.#duracion || this.#intervalo) && this.#ejecucion != 2){
            if(this.#duracion < this.#intervalo) throw("la duracion es menor al intervalo");
            if(!this.#ejecucion && this.#espera > 0) this.#stout = setTimeout(()=>this.#refuncion(),tiempo);
            else this.#refuncion();}

        else if (this.#duracion || this.#intervalo) this.#refuncion();
        this.#ejecucion = 0;}
/**
 * Alterna entre `detener()` y `arrancar()` segun sea el caso
 */
    interruptor(){
        if(this.estaActivo) this.detener();
        else this.arrancar();}
/**
* Detiene la ejecucion en curso y elimina el contenido de la clase
*/
    destructor(){
        this.#puntoInicio();
        this.#espera = this.#fn = this.#duracion = undefined;
        this.#intervalo = 0;}

    #tiempoEjecucion(){return this.#tiempoTr + Date.now() - this.#tiempoInicial;}
/**
* Funcion que retorna el tiempo transcurrido de la ejecucion
* @return {number} Tiempo en milisegundos
*/
    cronometro(){return this.#bucle ? this.#tiempoEjecucion() : this.#tiempoTr}}

/**
 * Función para convertir milisegundos en un formato de tiempo.
 * @param {number} ms - La cantidad de milisegundos a convertir.
 * @returns {objetoTiempo} Objeto tiempo: `{d:días, h:horas, m:minutos, s:segundos, ms:milisegundos}`.
 */
function TaimyForm(ms){
    const formato = {d:0,h:0,m:0,s:0,ms:0};
    if(!ms || ms <= 0) return formato;

    let milisegundos = ms;
    
    if(ms >= 0x5265C00){
        milisegundos = (ms & 0x7FFFFFF) ^ 0x5265C00;
        formato.d = ~~(ms / 86400000);}

    formato.h= ~~(milisegundos/3600000);
    milisegundos %= 3600000;
    formato.m = ~~(milisegundos/60000);
    milisegundos %= 60000;
    formato.s =  ~~(milisegundos/1000);
    formato.ms = milisegundos % 1000;
    return formato;}
/**
 * Función para convertir un `formato de tiempo` en un `String`.
 * @param {object} objetoTiempo - Objeto tiempo: `{d:días, h:horas, m:minutos, s:segundos, ms:milisegundos}`.
 * @property {number} d - Días.
 * @property {number} h - Horas.
 * @property {number} m - Minutos.
 * @property {number} s - Segundos.
 * @property {number} ms - Milisegundos.
 * --- 
 * @param {string|undefined} formato - formato en que mostrara el reloj desde el principio como minimo debe contener 2 parametros a mostrar
 * >***ejemplo:***
 * + `"d/h/m/s/sm" = 00:00:00:00:00`
 * + `"h/m/s" = 00:00:00`
 * + `"s/ms" = 00:00`
 * + `undefined` el formato ira creciendo automaticamente `59:99 + (10ms) = 01:00:00`
 * --- 
 * @param {number} [limite=0] - limita la forma en que se mostrara el reloj
 * + `limite = 0`: El reloj ira creciendo como sea necesario
 * + `limite = 1`: Si el **formato** a limitado los parametros mostrados *ejemplo:* `"h/m/s" = 23:59:59` al llegar al limite del paramatro maximo todos volveran a su estado inicial *ejemplo:* `23:59:59 + (1s) = 00:00:00`
 * + `limite = 2`: Si el **formato** a limitado los parametros mostrados *ejemplo:* `"h/m/s" = 23:59:59` el parametro maximo no tendra limites *ejemplo:* `23:59:59 + (1s) = 24:00:00`
 * > _Si formato es `undefined` o `"d/h/m/s/sm"` limite es **ignorado**_
 */
function TaimyReloj(objetoTiempo,formato = undefined,limite = 0){
    if(!objetoTiempo) return '--:--';
    const str = function(p){ return p > 9?`${p}`:`0${p??0}`;};
    const {ms,s,m,h,d} = objetoTiempo;

    if(formato){
        const parametros = formato.split('/');
        if(parametros.length < 2 || parametros.length > 5) return '--:--';
        const data = {ms:{n:'s',i:60,v:~~(ms/10),r:0},s:{n:'m',i:60,v:s,r:1},m:{n:'h',i:60,v:m,r:2},h:{n:'d',i:24,v:h,r:3},d:{n:'d',i:1,v:d,r:4}}
        let STR = '';
        let p = '';
        let x = 'ms';
        let izq = false;

        for(let i = 0; i < parametros.length; ++i){
            p = parametros[i];
            if(data[x].r < data[p].r) {
                const mitad = (parametros.length - 1) / 2;
                x = p;
                izq = i < mitad;}
            const valor = limite != 2 ? data[p].v : (data[data[x].n].v && p == x? data[p].v + (data[p].i * data[data[p].n].v):data[p].v)
            if(i < parametros.length - 1) STR += `${str(valor)}:`;
            else STR += str(valor);}

        if(!limite){
            const boleano = [data[data[data[data[x].n].n].n].v,data[data[data[x].n].n].v,data[data[x].n].v]

            if(boleano[0]||boleano[1]|| boleano[2]){
                let contador = 0;
                let nstr = [];
                let ok = false;
                while(contador < 3){
                    if(!boleano[contador] && !ok) {
                        ++contador;
                        nstr.push('');
                        continue;}
                    ok = true;
                    const s = str(boleano[contador]);
                    if(izq) nstr.push(`${s}:`);
                    else nstr.push(`:${s}`);
                    ++contador;}
                if(izq) STR = (nstr[0] + nstr[1] + nstr[2]) + STR;
                else STR += (nstr[2] + nstr[1] + nstr[0])}}

        return STR;}
    else{
        return`${d?str(d) + ':':''}${h || d ?str(h) + ':':''}${m || h || d?str(m) + ':':''}${str(s)}:${str(~~(ms/10))}`;}
}

export {Taimy,TaimyForm,TaimyReloj}