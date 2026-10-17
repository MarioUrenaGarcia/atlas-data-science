---
id: muestreo-de-reservorio
titulo: Muestreo de reservorio
titulo_en: Reservoir sampling
alias:
  - algoritmo R
  - muestreo de flujos
  - muestreo en línea
modulo: 5
submodulo: '5.1'
orden: 21
nivel: intermedio
prerrequisitos:
  - muestreo-aleatorio-simple
  - induccion-matematica
relaciones:
  - tipo: relacionado
    id: muestreo-con-y-sin-reemplazo
etiquetas:
  - flujos de datos
  - algoritmos
  - memoria constante
  - muestra uniforme
resumen: >
  Algoritmo que mantiene una muestra aleatoria simple de k elementos de un flujo cuya longitud no se
  conoce de antemano, usando memoria constante. Cada elemento nuevo entra con probabilidad k/t.
formula: 'P(\text{el elemento } t \text{ entra}) = \frac{k}{t}, \qquad P(i \in \text{reservorio tras } N) = \frac{k}{N}'
visualizacion:
  componente: SamplingProcess
  parametros:
    modo: reservorio
    longitud: 30
    k: 5
    repeticiones: 2000
    nombreElemento: Registro
referencias:
  - clave: lohr
publicado: true
---

## Intuición

Un servidor recibe registros de actividad sin parar y se quiere guardar una muestra de 5 para revisarlos a mano al final del día. No se sabe cuántos registros llegarán, ni hay espacio para guardarlos todos y sortear al final. ¿Cómo decidir, registro por registro, cuáles conservar, de modo que al final la muestra sea tan aleatoria como si se hubiera sorteado entre todos?

El **muestreo de reservorio** resuelve el problema con una regla sencilla. Los primeros 5 registros entran directo al reservorio. Cuando llega el registro número $t$, se le da una probabilidad $5/t$ de entrar; si entra, reemplaza a uno de los 5 guardados, elegido al azar. Al principio casi todos entran; después, cada vez es más difícil, porque el registro nuevo compite con todos los que ya pasaron. El equilibrio es exacto: al terminar, cada registro, el primero o el último, tiene la misma probabilidad de estar en el reservorio.

## Definición

:::definicion[Algoritmo R]
Para obtener una muestra de tamaño $k$ de un flujo $x_1, x_2, \dots$:

1. Para $t = 1, \dots, k$, guardar $x_t$ en la casilla $t$ del reservorio.
2. Para cada $t > k$, elegir $j$ uniforme en $\{1, \dots, t\}$. Si $j \le k$, reemplazar el contenido de la casilla $j$ por $x_t$; si $j > k$, descartar $x_t$.
:::

Tras procesar $N \ge k$ elementos, cada uno está en el reservorio con probabilidad $k/N$, y de hecho el reservorio es un muestreo aleatorio simple de tamaño $k$. La prueba es por inducción: si tras $t - 1$ elementos cada uno está con probabilidad $k/(t-1)$, al llegar el elemento $t$ uno de los anteriores sigue si el nuevo no entra o si entra pero no lo reemplaza:
$$
\frac{k}{t-1}\left[\left(1 - \frac{k}{t}\right) + \frac{k}{t}\cdot\frac{k-1}{k}\right] = \frac{k}{t-1}\cdot\frac{t-1}{t} = \frac{k}{t},
$$
y el nuevo entra con probabilidad $k/t$. El algoritmo usa memoria $O(k)$ y un número aleatorio por elemento.

:::nota[Qué significa cada símbolo]
- $k$: tamaño del reservorio.
- $t$: posición del elemento que llega en el flujo.
- $j$: número aleatorio uniforme entre 1 y $t$.
- $N$: longitud total del flujo, que no necesita conocerse de antemano.
- $k/t$: probabilidad de que el elemento $t$ entre al reservorio.
:::

## Cómo usar la visualización

La fila de arriba es el flujo de 30 registros; los que están en el reservorio se resaltan y el último en llegar tiene borde rojo. Abajo están las 5 casillas del reservorio. El encabezado muestra el número aleatorio $j$ de cada paso y si el registro entra o se descarta. Al terminar el flujo, se repite 2000 veces y la gráfica de barras muestra con qué frecuencia terminó cada registro en el reservorio.

Experimentos sugeridos:

- Observa que los primeros registros entran siempre y que, hacia el final, la mayoría se descarta.
- Al terminar las repeticiones, compara las barras con la línea punteada $k/N = 5/30$: son parejas.
- Cambia $k$ a 1: la frecuencia de cada registro baja a $1/30$ y sigue siendo pareja.

## Ejemplo

Con $k = 2$ y un flujo de 4 elementos:

1. Los elementos 1 y 2 entran: reservorio $\{1, 2\}$.
2. Llega el 3: entra con probabilidad $2/3$. Si sale $j = 2$, reemplaza la casilla 2: reservorio $\{1, 3\}$.
3. Llega el 4: entra con probabilidad $2/4 = 1/2$. Si sale $j = 4$, se descarta.
4. Probabilidad final del elemento 1: sobrevive a la llegada del 3 con probabilidad $1 - \frac{2}{3}\cdot\frac{1}{2} = \frac{2}{3}$ y a la del 4 con $1 - \frac{1}{2}\cdot\frac{1}{2} = \frac{3}{4}$; en total $\frac{2}{3}\cdot\frac{3}{4} = \frac{1}{2} = \frac{k}{N}$.
5. El elemento 4 entra con probabilidad $\frac{1}{2}$: los cuatro tienen la misma probabilidad.

:::figura[Un flujo corto de 10 lecturas de un sensor con un reservorio de 2: cada paso muestra el sorteo de j y, al repetir, todas las lecturas terminan en el reservorio con frecuencia cercana a 2/10.]{componente="SamplingProcess"}
```yaml
modo: reservorio
longitud: 10
k: 2
repeticiones: 3000
nombreElemento: Lectura
semilla: 5
```
:::

## Propiedades

- **Muestra uniforme sin conocer $N$**: la probabilidad final $k/N$ se alcanza aunque el flujo pudiera haber terminado en cualquier momento.
- **El reservorio es un muestreo aleatorio simple** en cualquier instante: tras $t$ elementos, cada subconjunto de $k$ de ellos es igualmente probable.
- **Memoria constante y una sola pasada** por los datos.
- **Se extiende a pesos**: hay variantes en las que cada elemento entra con probabilidad proporcional a un peso.

:::figura[Propiedad de uniformidad con un reservorio de 1: de 40 transacciones se conserva una sola, y cada una termina guardada aproximadamente una de cada 40 veces.]{componente="SamplingProcess"}
```yaml
modo: reservorio
longitud: 40
k: 1
repeticiones: 4000
nombreElemento: Transacción
```
:::

## Errores comunes

- **Dar a cada elemento nuevo una probabilidad fija**, por ejemplo $1/2$, de entrar. Así los últimos elementos dominan el reservorio y los primeros casi nunca sobreviven.
- **Elegir el número aleatorio entre 1 y $k$ en lugar de entre 1 y $t$.** Entonces todo elemento nuevo entra y el reservorio termina con los últimos $k$.
- **Pensar que los primeros elementos tienen ventaja porque entran seguro.** Entran seguro, pero cada llegada posterior puede expulsarlos; las dos fuerzas se compensan exactamente.

:::figura[Error de pensar que los primeros tienen ventaja: con 20 pedidos y un reservorio de 4, los primeros cuatro entran siempre, pero al final terminan guardados con la misma frecuencia que el resto.]{componente="SamplingProcess"}
```yaml
modo: reservorio
longitud: 20
k: 4
repeticiones: 3000
nombreElemento: Pedido
```
:::

## Conexiones

El muestreo de reservorio produce un [[muestreo-aleatorio-simple]] cuando los datos llegan en secuencia, y su corrección se demuestra por [[induccion-matematica]]. Es una herramienta de los sistemas que procesan flujos de datos, del mismo modo que el [[muestreo-con-y-sin-reemplazo|muestreo sin reemplazo]] lo es para listas completas, y se usa para mantener muestras representativas en bases de datos y en la depuración de sistemas de aprendizaje automático.

## Formulario

:::formula[Probabilidad de entrada del elemento t]
$$
P(x_t \text{ entra}) = \frac{k}{t}, \qquad t > k
$$

- $k$: tamaño del reservorio; $t$: posición del elemento.
:::

:::formula[Paso inductivo]
$$
\frac{k}{t-1}\left[\left(1 - \frac{k}{t}\right) + \frac{k}{t}\cdot\frac{k-1}{k}\right] = \frac{k}{t}
$$

- Primer factor: probabilidad de estar en el reservorio tras $t - 1$ elementos.
- Corchete: probabilidad de no ser expulsado por el elemento $t$.
:::

:::formula[Probabilidad final de inclusión]
$$
P(x_i \in \text{reservorio tras } N \text{ elementos}) = \frac{k}{N}
$$

- $N$: longitud total del flujo.
:::
