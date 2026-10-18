---
id: desigualdad-de-mcdiarmid
titulo: Desigualdad de McDiarmid
titulo_en: McDiarmid's inequality
alias:
  - desigualdad de diferencias acotadas
  - desigualdad de Azuma y McDiarmid
modulo: 1
submodulo: '1.5'
orden: 11
nivel: avanzado
prerrequisitos:
  - desigualdad-de-hoeffding
relaciones:
  - tipo: generaliza
    id: desigualdad-de-hoeffding
  - tipo: relacionado
    id: concentracion-de-la-medida
etiquetas:
  - diferencias acotadas
  - funciones de variables independientes
  - pelotas y cajas
  - estabilidad
resumen: >
  Si cambiar una sola de n variables independientes altera una función a lo más en c_i, la función se
  concentra alrededor de su media: P(f - E f ≥ t) ≤ exp(-2t²/Σc_i²). Extiende Hoeffding de sumas a
  funciones generales.
formula: 'P\big(f - \mathbb{E}[f] \ge t\big) \le \exp\!\left(-\frac{2t^2}{\sum_{i=1}^{n} c_i^2}\right)'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: mcdiarmid
    bolas: 50
    umbral: 5
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Se lanzan 50 bolas al azar en 50 cajas y se cuentan las cajas vacías. Calcular la distribución exacta de ese conteo es complicado, pero hay una observación simple: si se mueve una sola bola a otra caja, el número de cajas vacías cambia a lo más en 1. Ninguna bola por sí sola tiene mucha influencia sobre el resultado.

La **desigualdad de McDiarmid** convierte esa estabilidad en concentración: una función de muchas variables independientes en la que ninguna variable influye demasiado se comporta casi como una constante, su media. Es la misma idea de la desigualdad de Hoeffding, pero para cualquier función, no solo para sumas: el número de cajas vacías, el número de colores necesarios para un grafo aleatorio o el error de un modelo entrenado con una muestra.

## Definición

:::teorema[Desigualdad de McDiarmid]
Sean $X_1, \dots, X_n$ independientes y $f$ una función con **diferencias acotadas**: cambiar solo la coordenada $i$ altera $f$ en a lo más $c_i$,
$$
\big|f(x_1, \dots, x_i, \dots, x_n) - f(x_1, \dots, x_i', \dots, x_n)\big| \le c_i.
$$
Entonces, para todo $t > 0$,
$$
P\big(f - \mathbb{E}[f] \ge t\big) \le \exp\!\left(-\frac{2t^2}{\sum_{i=1}^{n} c_i^2}\right),
$$
y lo mismo para $P(f - \mathbb{E}[f] \le -t)$.
:::

La prueba escribe $f - \mathbb{E}[f]$ como una suma de incrementos, revelando las variables una por una (una martingala de Doob), y aplica a cada incremento el lema de Hoeffding.

:::figura[Veinte bolas en veinte cajas: la media de cajas vacías es $20 \cdot 0.95^{20} \approx 7.2$, y la cota para superarla en 3 es $e^{-2 \cdot 9/20} \approx 0.41$, muy por encima de la proporción simulada.]{componente="InequalityBound"}
```yaml
modo: mcdiarmid
bolas: 20
umbral: 3
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: variables independientes.
- $f$: función de las $n$ variables.
- $c_i$: cambio máximo de $f$ al modificar solo la variable $i$.
- $t$: desviación respecto a la media.
- $m$: número de bolas y de cajas del ejemplo.
- $x_i$, $x_i'$: dos valores posibles de la variable $i$.
- $\mathbb{E}[f]$: media de $f(X_1, \dots, X_n)$; $\exp(x) = e^x$.
:::

## Cómo usar la visualización

Cada repetición lanza 50 bolas en 50 cajas y cuenta las vacías. A la izquierda se acumula el histograma de ese conteo, con la media $50 \cdot 0.98^{50} \approx 18.2$ y el umbral $\mathbb{E}[f] + t$ marcados; las barras más allá del umbral se resaltan. A la derecha, la proporción simulada de repeticiones que superan la media en $t$ o más y la cota $e^{-2t^2/50}$ como funciones de $t$. El encabezado compara los dos números para el $t$ elegido.

La deslizadera cambia $t$. La cota siempre queda por encima de la proporción simulada; la distancia muestra que McDiarmid no usa la varianza real, solo las diferencias acotadas.

## Ejemplo

Una tabla de dispersión reparte $m = 100$ claves al azar en 100 posiciones. Sea $f$ el número de posiciones vacías.

1. Media: $\mathbb{E}[f] = 100\,(1 - 1/100)^{100} \approx 36.6$.
2. Mover una clave cambia $f$ en a lo más 1, así que $c_i = 1$ y $\sum_i c_i^2 = 100$.
3. $P(f \ge 46.6) \le e^{-2 \cdot 100/100} = e^{-2} \approx 0.135$; para las dos colas, $P(|f - 36.6| \ge 10) \le 0.27$.
4. Para que la cota sea 0.01 basta $t = \sqrt{50 \log 100} \approx 15.2$.

:::figura[El ejemplo de la tabla: con 100 posiciones y $t = 10$ la cota es $e^{-2} \approx 0.135$; las simulaciones casi nunca se alejan tanto de 36.6.]{componente="InequalityBound"}
```yaml
modo: mcdiarmid
bolas: 100
umbral: 10
```
:::

## Propiedades

- **Generaliza a Hoeffding:** con $f = \sum_i X_i$ y $X_i \in [a_i, b_i]$, $c_i = b_i - a_i$ y se recupera la desigualdad de Hoeffding para la suma.
- **Escala:** si cada $c_i$ es del orden de $1/n$, como en un promedio, la desviación típica de $f$ es a lo más del orden de $1/\sqrt{n}$.
- **Estabilidad de algoritmos:** si cambiar un dato del entrenamiento cambia poco el error de un modelo, ese error se concentra alrededor de su media.
- **No usa la varianza:** en problemas donde la varianza es mucho menor que $\sum c_i^2$, otras desigualdades dan cotas más finas.

:::figura[Con 200 bolas y $t = 10$ la cota es $e^{-1} \approx 0.37$, aunque la desviación estándar real del número de cajas vacías es menor que 5.]{componente="InequalityBound"}
```yaml
modo: mcdiarmid
bolas: 200
umbral: 10
```
:::

## Errores comunes

- **Verificar las diferencias solo en casos típicos.** La condición debe cumplirse para todas las configuraciones posibles, no solo en promedio.
- **Aplicarla a variables dependientes.** La prueba revela las variables una a una y necesita independencia.
- **Esperar cotas útiles para $t$ pequeño.** Con $t^2$ mucho menor que $\sum c_i^2 / 2$ la cota está cerca de 1.

:::figura[Con 50 bolas y $t = 2$ la cota es $e^{-0.16} \approx 0.85$: desviaciones del tamaño de la dispersión típica no se pueden descartar.]{componente="InequalityBound"}
```yaml
modo: mcdiarmid
bolas: 50
umbral: 2
```
:::

## Conexiones

La desigualdad de McDiarmid generaliza la [[desigualdad-de-hoeffding]] de sumas a funciones con diferencias acotadas y es un caso del fenómeno de [[concentracion-de-la-medida]]. Se apoya en la [[independencia-de-variables-aleatorias]] y, como Hoeffding, se combina con la [[cota-de-la-union]] para dar garantías simultáneas. Su prueba usa martingalas, que reaparecen en el estudio de procesos estocásticos.

## Formulario

:::formula[Desigualdad de McDiarmid]
$$
P\big(f - \mathbb{E}[f] \ge t\big) \le \exp\!\left(-\frac{2t^2}{\sum_{i=1}^{n} c_i^2}\right)
$$

- $X_1, \dots, X_n$: variables independientes; $n$: número de variables.
- $f = f(X_1, \dots, X_n)$: función con diferencias acotadas; $\mathbb{E}[f]$: su media.
- $t > 0$: desviación sobre la media; $\exp(x) = e^x$.
- $c_i$: cambio máximo de $f$ al modificar solo la variable $i$. La misma cota vale para $P(f - \mathbb{E}[f] \le -t)$.
:::

:::formula[Diferencias acotadas]
$$
\big|f(x_1, \dots, x_i, \dots, x_n) - f(x_1, \dots, x_i', \dots, x_n)\big| \le c_i
$$

- $x_i$, $x_i'$: dos valores cualesquiera de la variable $i$.
- Debe cumplirse para todos los valores de las demás variables.
:::

:::formula[Cajas vacías]
$$
\mathbb{E}[f] = m\left(1 - \frac{1}{m}\right)^{m}, \qquad P\big(f - \mathbb{E}[f] \ge t\big) \le e^{-2t^2/m}
$$

- $m$: número de bolas, lanzadas al azar e independientes, y de cajas; $f$: número de cajas vacías; $t > 0$: exceso sobre la media.
- $(1 - 1/m)^m$: probabilidad de que una caja dada quede vacía; cada bola cambia $f$ en a lo más 1, así que $c_i = 1$.
:::
