<h1 align="center">⏱ Taimy ⏳<h1/>

<p align="center"><a href="#"><img src="https://i.ibb.co/M2q680C/Taimy-sm.png" alt="imagen representativa de Taimy"></a><p/>


## **Taimy**

Taimy es una clase que ejecuta funciones dentro de un período de tiempo específico de manera más sencilla.  
[ver demo](#demo)

###### instalacion:
``` bash
npm i taimy
```


#### ¿Qué soluciona Taimy?
> _Si bien setInterval y setTimeOut hacen lo mismo que Taimy, algunas diferencias son:_
1. La comodidad de [destruir el hilo](#reinicio-y-destrucción) de ejecución ya sea de manera automática: `especificando una duración`, de forma manual usando los métodos `detener()` y/o `destructor()`, incluso al [iniciar un nuevo hilo.](#nuevo)
2. La habilidad de [detener y reanudar](#arranque-y-pausadetener) el hilo de ejecución a placer.
3. La posibilidad de [cambiar los parámetros](#configuración) de `duracion`, `intervalo`, `tiempo de espera` y la `función` en tiempo de ejecución.
4. La seguridad de evitar ***interval memory leak*** en la mayor parte de lo posible, reejecuciones y uso indiscriminado de múltiples hilos.

## **Documentación**

### Constructor
> -- *(opcional)* --
``` JavaScript
const instanciaTaimy = new Taimy(fn, dataTiempo);
```

+ **fn**:  (*opcional*) Función a ejecutarse, puede aceptar un *cronometro* como parámetro: *`cronometro => { código }`*
+ **dataTiempo**: (*opcional*) Objeto `{espera, duracion, intervalo}` debe contener como mínimo la propiedad: __*intervalo*__ o __*espera*__ todas estas variables aceptan valores numéricos expresados en milisegundos.

### Nuevo

``` JavaScript
const instanciaTaimy = new Taimy;
instanciaTaimy.nuevo(fn,dataTiempo);
```
Exactamente lo mismo que el [constructor](#constructor) solo que aquí es de forma obligatoria.  
> *tener en cuenta que si existe un hilo de ejecución corriendo este será eliminado*.

### Configuración

``` JavaScript
const instanciaTaimy = new Taimy;
instanciaTaimy.funcion = function(cronometro){
    /*código*/
    };
instanciaTaimy.duracion = 50000; // milisegundos
instanciaTaimy.cambiarDuracion(50000); // milisegundos

instanciaTaimy.intervalo = 3000; // milisegundos
instanciaTaimy.cambiarIntervalo(3000); // milisegundos

instanciaTaimy.espera = 100; // milisegundos
instanciaTaimy.cambiarEspera(100); // milisegundos
```
> *Si se encuentra en ejecución los cambios se verán reflejados al instante sin nesecidad de volver a [`arrancar`](#arranque-y-pausadetener) Taimy*.
+ **`funcion`** : La función que se pretende ejecutar, esta puede recibir un parámetro cronómetro que contiene el tiempo transcurrido en milisegundos.
+ **`duracion / cambiarDuracion`** : la duración puede ser `finita` al darle un **valor numérico** o `infinita` al signarle **undefined**.

+ **`intervalo / cambiarIntervalo`** : Lapso de tiempo en que se estará ejecutando la función repetidamente.

+ **`espera / cambiarEspera`** : Tiempo que esperará para comenzar a ejecutarse.

### Arranque y Pausa/Detener

``` JavaScript
instanciaTaimy.arrancar(); // comienza la ejecución
instanciaTaimy.detener(); // detiene/pausa la ejecución
document.addEventListener('click',instanciaTaimy.interruptor); // detiene/pausa o reanuda la ejecución
```
+ **`arrancar`** : Da la orden de comenzar o reanudar la ejecución.
+ **`detener`** : Detiene o pausa _"segun como desee verlo"_ la ejecución para despues ser reanudado.
+ **`interruptor`** : alterna entre `arrancar` y `detener` dependiendo de el estado de ejecución en que se encuentre.

### Reinicio y Destrucción

``` JavaScript
instanciaTaimy.reiniciar();
instanciaTaimy.reinicioTotal();
instanciaTaimy.destructor();
```
+ **`reiniciar`** : Reinicia la ejecución desde el comienzo
+ **`reinicioTotal`** : Reinicia la ejecución apartir desde el tiempo de espera

+ **`destructor`** : Detiene la ejecución en curso y formatea el contenido interno de la instanacia para dejarla vacía.

> _Cabe mencionar que los métodos de `reiniciar` y `reinicioTotal` reinician el propio hilo de ejecución no la funcion otorgada por lo que si desea que su funcion también sea reiniciada puede usar el valor de inicio del cronómetro como referencia ya que este siempre al inicio es **0**_  

``` JavaScript
// ejemplo
instanciaTaimy.funcion = function (cronometro){ 
    if(!cronometro)
        {/*código de reinicio*/}
    /*código*/}

instanciaTaimy.reiniciar();
```  
<br/>

### Funciones extras

``` JavaScript
const objetoTiempo = TaimyForm(123456789); //milisegundos
const reloj = TaimyReloj(objetoTiempo) //objeto {d,h,m,s,ms}
console.log(objetoTiempo);
console.log(reloj);
```
###### terminal:
``` terminal
> Object { d: 1, h: 11, m: 36, s: 23, ms: 573 }
    d: 1
    h: 11
    m: 36
    ms: 573
    s: 23
​   > <prototype>: Object { … }

01:11:36:23:57
```

**`TaimyForm( ms )`** :
+ Función que admite `milisegundos`
+ Retorna un objeto `{d,h,m,s,ms}` d = días, h = horas, m = minutos, s = segundos, ms = milisegundos.  

**`TaimyReloj( objetoTiempo , formato , limite)`** :

+ `objetoTiempo` -> `{d,h,m,s,ms}`
+ `formato` -> {**string**} *(opcional)*  que indica la forma y orden en que se va mostrar el reloj como mínimo debe espesificar **2** elementos válidos y máximo **5**.  
 _\< ejemplo \>_ :  
 Si solo se quiere mostrar la hora, minuto y segundo `"h/m/s"` el resultado sería `11:36:23`  
 Para mostrar los milisegundos,minutos,días `"sm/m/d"`, resultado: `57:36:01`.
 + `limite` -> {**number**} *(si formato no está definido este automáticamente se ignora)* define los límites de como se muestra el string reloj:  
 _`limite = 0` :_ El reloj irá creciendo como sea necesario *ejemplo*: `59:59` + (1s) = `01:00:00`.  
 _`limite = 1` :_ El reloj será fijo y al llegar al límite del parámetro máximo todos volverán a su estado inicial *ejemplo:* `23:59:59` + (1s) = `00:00:00`.  
 _`limite = 2` :_ El reloj será fijo y el parámetro maximo no tendrá limites *ejemplo:* `23:59:59 + (1s) = 24:00:00`.

<br/>

## **DEMO**

<p align="center"><a href="#"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejhqNXh0M3lkYmd5azhpbWt0eWJvNm5zY3BjYTJtb3VkZHJiOTRneSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fL4IcYID7dzTzsuAHA/source.gif" alt="Demo de Taimy"></a><p/>

``` JavaScript
import {Taimy, TaimyForm,TaimyReloj} from "taimy.js";

const img = document.getElementById('fotograma-clave');
const span = document.getElementById('cronometro');
const btn_x = document.getElementById('eliminar');
const btn_pausar = document.getElementById('pausar');
const btn_reiniciar = document.getElementById('reiniciar');
const input_fps = document.getElementById('fps');

let fps = 12;
input_fps.value = fps;

//secuencia de imágenes con nombres del 0 al 11 en formato PNG
const fotogramas = {
    frame : 0,
    siguiente(){
        if(this.frame > 11) 
            this.frame = 0;
        return `./${this.frame++}.png`;}}

//sección del cronómetro
const cronometro = new Taimy;

cronometro.funcion = function (ms){
    const formatoTiempo = TaimyForm(ms);
    span.innerText = TaimyReloj(formatoTiempo);
    }
cronometro.intervalo = 100;

//sección de la animación
const instanciaTaimy = new Taimy(
    cronometro=>{
        if(!cronometro){
            fotogramas.frame = 0;
            }
        img.src = fotogramas.siguiente();
        },
    {intervalo:1000/fps});

//comenzar la ejecución
instanciaTaimy.arrancar();
cronometro.arrancar();

// introducir los fps de la animación
input_fps.addEventListener('keydown',e =>{
    if(e.keyCode != 13 || !input_fps.value) 
        return;
    fps = input_fps.value;
    instanciaTaimy.intervalo = 1000/fps;
    });

//lógica de los botones

btn_x.addEventListener('click',()=>{
    cronometro.destructor();
    instanciaTaimy.destructor();
    });

btn_pausar.addEventListener('click',instanciaTaimy.interruptor);

btn_reiniciar.addEventListener('click',()=>{
    cronometro.reiniciar();
    instanciaTaimy.reiniciar();
    });
```
<br/>
<br/>

###### *Todos los personajes presentados en esta librería fueron diseñados y creados por mí ~ [Neko ★ Shooter.](https://github.com/NekoShooter)*