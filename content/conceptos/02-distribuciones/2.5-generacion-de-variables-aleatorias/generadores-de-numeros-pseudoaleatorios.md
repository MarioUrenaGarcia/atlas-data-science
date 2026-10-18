---
id: generadores-de-numeros-pseudoaleatorios
titulo: Generadores de números pseudoaleatorios
titulo_en: Pseudorandom number generators
alias:
  - PRNG
  - números pseudoaleatorios
  - generador de números aleatorios
modulo: 2
submodulo: '2.5'
orden: 1
nivel: intermedio
prerrequisitos:
  - distribucion-uniforme-continua
  - independencia-de-eventos
relaciones:
  - tipo: relacionado
    id: semillas-y-reproducibilidad
etiquetas:
  - simulación
  - números aleatorios
  - uniforme
  - periodo
  - Monte Carlo
resumen: >
  Algoritmos deterministas que producen sucesiones de números que se comportan como uniformes e
  independientes. Toda simulación parte de ellos y los transforma en otras distribuciones.
formula: 's_{n+1} = T(s_n), \qquad u_n = G(s_n) \in [0, 1)'
visualizacion:
  componente: RandomLab
  parametros:
    modo: pares
    generador: mt
    valores:
      n: 1000
      semilla: 1
    casos:
      - nombre: 'Muestra mediana'
        descripcion: 'Mil pares del Mersenne Twister: el cuadrado se llena de forma pareja, sin franjas ni huecos.'
        valores: {n: 1000, semilla: 1}
      - nombre: 'Muestra grande'
        descripcion: 'Cuatro mil pares: la nube se vuelve una mancha uniforme; los pequeños grumos de la muestra mediana eran puro azar.'
        valores: {n: 4000, semilla: 1}
      - nombre: 'Otra semilla'
        descripcion: 'Semilla 42: otros puntos, la misma uniformidad; cambiar la semilla cambia la muestra, no la calidad.'
        valores: {n: 1000, semilla: 42}
referencias:
  - clave: ross-procesos
  - clave: murphy
publicado: true
---

## Intuición

Una simulación de Monte Carlo necesita millones de números al azar: para sortear llegadas de clientes, para generar datos sintéticos, para estimar una integral. Lanzar dados o medir ruido físico sería lento e imposible de repetir. Por eso las computadoras usan generadores pseudoaleatorios: algoritmos completamente deterministas que, a partir de un estado inicial, producen una sucesión de números que se comporta como si fueran uniformes en el intervalo de cero a uno e independientes.

"Pseudo" porque no hay azar real: el mismo estado inicial (la semilla) produce siempre la misma sucesión, y como el estado tiene un tamaño finito, tarde o temprano la sucesión se repite. Un buen generador tiene un periodo enormemente largo, reparte sus valores de manera pareja y no deja patrones entre valores consecutivos, de modo que ninguna prueba estadística razonable lo distinga de una fuente verdaderamente aleatoria.

Una forma directa de ver la calidad es graficar cada valor contra el siguiente. Si los números fueran independientes y uniformes, los pares llenarían el cuadrado de manera pareja. Los generadores defectuosos dejan líneas, franjas o huecos que delatan su estructura.

## Definición

:::definicion[Generador pseudoaleatorio]
Un **generador de números pseudoaleatorios** es una terna $(S, T, G)$: un conjunto finito de estados $S$, una función de transición $T: S \to S$ y una función de salida $G: S \to [0, 1)$. A partir de una semilla $s_0$ produce
$$
s_{n+1} = T(s_n), \qquad u_n = G(s_n).
$$
Como $S$ es finito, la sucesión es periódica a partir de algún punto; el **periodo** es la longitud del ciclo.
:::

Un generador es bueno si su periodo es mucho mayor que cualquier número de valores que se vaya a usar y si las sucesiones $(u_n)$ pasan pruebas de uniformidad e independencia en varias dimensiones, por ejemplo que los vectores $(u_n, u_{n+1}, \dots, u_{n+k-1})$ se repartan uniformemente en el hipercubo.

:::nota[Qué es X]
$U_n$ = el número que el generador entrega en el paso $n$, que debe comportarse como una uniforme en $[0, 1)$ independiente de los anteriores.
:::

:::nota[Qué hace cada parámetro]
- **Semilla $s_0$:** el estado inicial. Si cambia, cambia toda la sucesión, aunque su calidad sea la misma.
- **Número de pares $n$:** cuántos valores consecutivos se grafican. Si aumenta, la nube debe acercarse a una mancha uniforme; si aparecen líneas, el generador tiene estructura.
- **Generador:** el algoritmo. El Mersenne Twister llena el cuadrado; un congruencial pequeño deja una red visible.
:::

:::nota[Qué significa cada símbolo]
- $S$: conjunto de estados; $s_n$: estado en el paso $n$; $s_0$: semilla.
- $T$: función de transición; $G$: función de salida.
- $u_n$: número entregado, en $[0, 1)$.
- $k$: dimensión en la que se examinan vectores de valores consecutivos.
:::

## Cómo usar la visualización

La gráfica pone cada valor $u_n$ en el eje horizontal y el siguiente, $u_{n+1}$, en el vertical. El selector cambia el generador: Mersenne Twister, un congruencial con módulo 256, RANDU o un generador sesgado. Los controles fijan cuántos pares y la semilla; el interruptor muestra la rebanada de ternas con el valor del medio fijo. El panel da la correlación serial y cuántos puntos distintos hay.

Con el Mersenne Twister sube $n$ a 4000 y observa una mancha pareja. Cambia al congruencial con $m = 256$ y observa una red de líneas con solo 256 puntos distintos. Elige RANDU y activa la rebanada de ternas: los puntos se acomodan en líneas paralelas.

## Ejemplo

El generador congruencial $s_{n+1} = (5s_n + 3) \bmod 16$, con salida $u_n = s_n/16$ y semilla $s_0 = 7$, es un ejemplo de juguete.

1. Estados: $7 \to 6 \to 1 \to 8 \to 11 \to 10 \to 5 \to 12 \to 15 \to 14 \to 9 \to 0 \to 3 \to 2 \to 13 \to 4 \to 7$.
2. Regresa a 7 después de 16 pasos: el periodo es 16, el máximo posible con 16 estados.
3. Las salidas son 0.375, 0.0625, 0.5, ... : todos los múltiplos de $1/16$ aparecen exactamente una vez por ciclo.
4. Para una simulación real un periodo de 16 es inútil: se necesita al menos $2^{60}$ y los generadores modernos usan $2^{19937} - 1$.
5. Además, como solo hay 16 valores posibles, los pares $(u_n, u_{n+1})$ ocupan 16 puntos del cuadrado: una red, no una nube.

:::figura[Congruencial pequeño: con m = 256 los pares consecutivos caen en una red de líneas paralelas; solo hay 256 puntos distintos.]{componente="RandomLab"}
```yaml
modo: pares
generador: lcg-pequeno
valores:
  n: 1000
  semilla: 7
```
:::

## Propiedades

- **Determinismo:** la misma semilla produce siempre la misma sucesión; eso permite reproducir simulaciones.
- **Periodicidad:** con $|S|$ estados el periodo es a lo más $|S|$; un estado de $b$ bits limita el periodo a $2^{b}$.
- **Equidistribución:** un buen generador reparte de forma pareja no solo los valores, sino los vectores de $k$ valores consecutivos para $k$ grandes.
- **Transformación:** a partir de uniformes se obtiene cualquier distribución por transformada inversa, aceptación y rechazo u otros métodos.
- **Uso criptográfico:** que una sucesión pase pruebas estadísticas no la hace impredecible; para seguridad se usan generadores criptográficos, distintos de los de simulación.

:::figura[Casos con contexto (muestra mediana, muestra grande, otra semilla): cada botón carga el número de pares y la semilla del Mersenne Twister.]{componente="RandomLab"}
```yaml
modo: pares
generador: mt
valores:
  n: 1000
  semilla: 42
casos:
  - nombre: 'Muestra mediana'
    descripcion: 'Mil pares: cuadrado lleno de forma pareja.'
    valores: {n: 1000, semilla: 1}
  - nombre: 'Muestra grande'
    descripcion: 'Cuatro mil pares: mancha uniforme.'
    valores: {n: 4000, semilla: 1}
  - nombre: 'Otra semilla'
    descripcion: 'Semilla 42: otra muestra, misma calidad.'
    valores: {n: 1000, semilla: 42}
```
:::

## Errores comunes

- **Creer que los números son realmente aleatorios.** Son deterministas; si se conoce el estado, se conocen todos los valores futuros.
- **Usar generadores viejos o de juguete.** Los congruenciales con módulo pequeño o RANDU dejan patrones que sesgan simulaciones en varias dimensiones.
- **Juzgar solo por el histograma.** Un generador puede tener un histograma perfecto y valores consecutivos muy dependientes; hay que mirar pares y ternas.
- **Usar un generador de simulación para contraseñas o llaves.** Su salida es predecible; para seguridad hace falta un generador criptográfico.

:::figura[Histograma perfecto, pares malos: el congruencial con m = 256 reparte sus valores con exactitud en cada ciclo, pero en la gráfica de pares sus puntos forman líneas.]{componente="RandomLab"}
```yaml
modo: pares
generador: lcg-pequeno
valores:
  n: 256
  semilla: 1
```
:::

## Conexiones

Producen aproximaciones de la [[distribucion-uniforme-continua]] con valores que imitan la [[independencia-de-eventos]]. El ejemplo más simple es el [[generador-congruencial-lineal]], y el más usado en estadística es el [[mersenne-twister]]. Su calidad se juzga con [[pruebas-de-aleatoriedad]] y su repetibilidad depende de [[semillas-y-reproducibilidad]]. A partir de sus uniformes se generan otras distribuciones con el [[muestreo-por-transformada-inversa]], el [[metodo-de-box-muller]] o el [[metodo-de-aceptacion-y-rechazo]]. El [[mapa-de-relaciones-entre-distribuciones]] muestra cómo se construyen unas distribuciones a partir de otras.

## Formulario

:::formula[Generador pseudoaleatorio]
$$
s_{n+1} = T(s_n), \qquad u_n = G(s_n)
$$

- $s_n$: estado; $T$: transición; $G$: salida en $[0, 1)$.
:::

:::formula[Cota del periodo]
$$
\text{periodo} \le |S| \le 2^{b}
$$

- $|S|$: número de estados; $b$: bits del estado.
:::

:::formula[Ejemplo congruencial]
$$
s_{n+1} = (5s_n + 3) \bmod 16, \qquad u_n = \frac{s_n}{16}
$$

- $\bmod$: residuo de la división; periodo 16 con cualquier semilla.
:::
