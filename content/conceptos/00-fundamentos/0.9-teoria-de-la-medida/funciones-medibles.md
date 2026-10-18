---
id: funciones-medibles
titulo: Funciones medibles
titulo_en: Measurable functions
alias:
  - función medible
  - función boreliana
  - variable aleatoria como función medible
modulo: 0
submodulo: '0.9'
orden: 6
nivel: avanzado
prerrequisitos:
  - espacio-medible
  - funcion-inversa-y-composicion
etiquetas:
  - teoría de la medida
  - preimagen
  - variables aleatorias
  - borelianos
resumen: >
  Una función es medible si la preimagen de cada conjunto medible es medible. Basta revisarlo con
  intervalos; las variables aleatorias son exactamente las funciones medibles de un espacio de probabilidad.
formula: 'f : (\Omega, \mathcal{F}) \to (\mathbb{R}, \mathcal{B}) \text{ medible} \iff f^{-1}(B) \in \mathcal{F} \ \text{para todo } B \in \mathcal{B}'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: preimagen
    funcion: onda
    intervalo: [0.25, 0.5]
referencias:
  - clave: durrett
  - clave: casella-berger
publicado: true
---

## Intuición

Para preguntar "¿con qué probabilidad la temperatura de mañana estará entre 20 y 25 grados?", hace falta que el conjunto de escenarios en los que eso ocurre sea un evento al que se le pueda asignar probabilidad. La temperatura es una función de los escenarios, y la pregunta se refiere a la preimagen del intervalo $[20, 25]$. Una función medible es una función para la que todas estas preguntas tienen sentido.

La definición mira hacia atrás: no importa adónde manda la función los conjuntos medibles, sino de dónde vienen los valores. Si para cada intervalo de valores el conjunto de puntos que caen en él es medible, la función es medible. Por eso las variables aleatorias se definen como funciones medibles: es la condición mínima para hablar de su distribución.

Casi todas las funciones que aparecen en la práctica, como las continuas, las monótonas, las escalonadas y los límites de sucesiones de ellas, son medibles.

## Definición

:::definicion[Función medible]
Sean $(\Omega, \mathcal{F})$ y $(E, \mathcal{E})$ espacios medibles. Una función $f : \Omega \to E$ es medible si
$$
f^{-1}(B) = \{\omega \in \Omega : f(\omega) \in B\} \in \mathcal{F} \quad \text{para todo } B \in \mathcal{E}.
$$
Para funciones reales con los borelianos basta comprobar que $\{f \le t\} \in \mathcal{F}$ para todo $t \in \mathbb{R}$.
:::

Una variable aleatoria es una función medible $X : (\Omega, \mathcal{F}, P) \to (\mathbb{R}, \mathcal{B})$, y su distribución es la medida imagen $P_X(B) = P(X^{-1}(B))$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F})$, $(E, \mathcal{E})$: espacios medibles de partida y de llegada.
- $f$: función; $f^{-1}(B)$: preimagen del conjunto $B$.
- $B$: conjunto medible del espacio de llegada.
- $\mathcal{B}$: sigma-álgebra de Borel de $\mathbb{R}$.
- $t$: número real; $\{f \le t\}$: puntos donde $f$ vale a lo más $t$.
- $X$: variable aleatoria; $P$: probabilidad; $P_X$: distribución de $X$.
:::

## Cómo usar la visualización

La curva es $f(x) = \tfrac{1}{2} + \tfrac{2}{5}\sin(2\pi x)$ en $[0, 1]$. La franja horizontal es un intervalo $B$ de valores y los segmentos gruesos sobre el eje horizontal son su preimagen $f^{-1}(B)$. La reproducción desliza $B$ hacia arriba; las lecturas dan cuántas piezas tiene la preimagen y su longitud.

Con $B = [0.25, 0.5]$ la preimagen tiene dos piezas, $[0.5, 0.607]$ y $[0.893, 1]$, con longitud total 0.215. Al subir la franja, la preimagen cambia de forma y de número de piezas, pero siempre es una unión finita de intervalos: un conjunto medible.

## Ejemplo

Para $f(x) = x^2$ en $[0, 1]$ se calcula la preimagen de $B = [0.25, 0.5]$.

1. $0.25 \le x^2 \le 0.5$ equivale a $0.5 \le x \le \sqrt{0.5} = 0.707$, porque $x \ge 0$.
2. $f^{-1}(B) = [0.5, 0.707]$, un intervalo, por lo tanto medible.
3. Su medida de Lebesgue es $0.707 - 0.5 = 0.207$: si $U$ es uniforme en $[0, 1]$, $P(0.25 \le U^2 \le 0.5) = 0.207$.

:::figura[Preimagen bajo x² de la franja que empieza en [0.25, 0.5]: un solo intervalo, [0.5, 0.707], de longitud 0.207; al subir la franja, el intervalo se corre a la derecha y se encoge.]{componente="MeasureLab"}
```yaml
modo: preimagen
funcion: cuadrado
intervalo: [0.25, 0.5]
```
:::

## Propiedades

- **Operaciones:** sumas, productos, cocientes con denominador no nulo y composiciones con funciones continuas de funciones medibles son medibles.
- **Límites:** $\sup_n f_n$, $\inf_n f_n$, $\limsup_n f_n$, $\liminf_n f_n$ y el límite puntual, cuando existe, son medibles.
- **Continuas y monótonas:** toda función continua o monótona de $\mathbb{R}$ en $\mathbb{R}$ es boreliana.
- **Indicadoras:** $\mathbf{1}_A$ es medible si y solo si $A$ es medible; las combinaciones lineales finitas de indicadoras son las funciones simples.

:::figura[Función escalón: la preimagen de cada franja es la mitad izquierda mientras la franja contiene 0.3, queda vacía cuando no contiene ningún valor y pasa a la mitad derecha cuando alcanza 0.8.]{componente="MeasureLab"}
```yaml
modo: preimagen
funcion: escalon
intervalo: [0.1, 0.35]
```
:::

- **Medida imagen:** si $f$ es medible, $\mu \circ f^{-1}$ es una medida en el espacio de llegada.

## Errores comunes

- **Exigir que la imagen de un conjunto medible sea medible.** La definición usa preimágenes; las imágenes de conjuntos medibles pueden no serlo.
- **Olvidar las sigma-álgebras.** Con $\mathcal{F} = \{\varnothing, \Omega\}$ solo las funciones constantes son medibles; la misma función puede ser medible o no según la sigma-álgebra de partida.
- **Pensar que una función medible debe ser continua.** La indicadora de los racionales no es continua en ningún punto y es medible.

:::figura[Raíz de x con la franja que empieza en [0.25, 0.5]: la preimagen es [0.0625, 0.25], más corta que la franja; una preimagen puede tener cualquier longitud, sin relación directa con el ancho de B.]{componente="MeasureLab"}
```yaml
modo: preimagen
funcion: raiz
intervalo: [0.25, 0.5]
```
:::

## Conexiones

Relaciona dos [[espacio-medible|espacios medibles]] mediante preimágenes, como en [[funcion-inversa-y-composicion]]. Las variables aleatorias son funciones medibles, y con ellas se define la [[integral-de-lebesgue]], que en probabilidad es la [[esperanza-matematica]]. La [[medida-de-lebesgue]] de las preimágenes da distribuciones, como en la [[transformada-integral-de-probabilidad]].

## Formulario

:::formula[Función medible]
$$
f^{-1}(B) \in \mathcal{F} \quad \text{para todo } B \in \mathcal{E}
$$

- $f$: función de $\Omega$ en $E$; $B$: conjunto medible de llegada; $\mathcal{F}$, $\mathcal{E}$: sigma-álgebras.
:::

:::formula[Criterio para funciones reales]
$$
\{\omega : f(\omega) \le t\} \in \mathcal{F} \quad \text{para todo } t \in \mathbb{R}
$$

- $t$: umbral real; basta revisar estos conjuntos porque generan los borelianos.
:::

:::formula[Distribución de una variable aleatoria]
$$
P_X(B) = P\big(X^{-1}(B)\big)
$$

- $X$: variable aleatoria; $P$: probabilidad; $P_X$: medida imagen en los borelianos.
:::
