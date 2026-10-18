---
id: truco-log-sum-exp
titulo: Truco log-sum-exp
titulo_en: Log-sum-exp trick
alias:
  - log-sum-exp
  - LSE
  - softmax estable
modulo: 0
submodulo: '0.7'
orden: 4
nivel: intermedio
prerrequisitos:
  - representacion-de-punto-flotante
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - desbordamiento
  - softmax
  - logaritmos
  - estabilidad
resumen: >
  Para calcular el logaritmo de una suma de exponenciales sin desbordar se resta primero el máximo:
  log Σ e^(x_i) = m + log Σ e^(x_i - m), con todos los exponenciales entre 0 y 1.
formula: '\log \sum_{i=1}^{n} e^{x_i} = m + \log \sum_{i=1}^{n} e^{x_i - m}, \qquad m = \max_i x_i'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: logsumexp
    valores: [1, 2, 3.5]
referencias:
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

En estadística y aprendizaje automático muchas cantidades son logaritmos de sumas de exponenciales: la constante de normalización de la función softmax, la log-verosimilitud de una mezcla de distribuciones, la energía libre de un modelo. Los exponentes suelen ser logaritmos de probabilidades y pueden ser números grandes, como 800, o muy negativos, como $-800$.

El problema es que la computadora no puede guardar $e^{800}$: el mayor número de precisión doble es cercano a $e^{709}$, y $e^{800}$ se desborda a infinito. Del otro lado, $e^{-800}$ es tan pequeño que se redondea a cero, y el logaritmo de cero es menos infinito. El resultado final, sin embargo, es un número razonable. El truco consiste en sacar como factor común la exponencial más grande: así todas las que quedan dentro de la suma están entre 0 y 1, al menos una vale exactamente 1, y el logaritmo que falta es pequeño y seguro.

## Definición

:::definicion[Log-sum-exp]
Para $x_1, \dots, x_n \in \mathbb{R}$,
$$
\operatorname{LSE}(x_1, \dots, x_n) = \log \sum_{i=1}^{n} e^{x_i}.
$$
Con $m = \max_i x_i$ se cumple la identidad exacta
$$
\operatorname{LSE}(\mathbf{x}) = m + \log \sum_{i=1}^{n} e^{x_i - m},
$$
en la que cada sumando está en $(0, 1]$ y la suma está entre 1 y $n$.
:::

La función softmax se calcula con el mismo desplazamiento: $\operatorname{softmax}(\mathbf{x})_i = \dfrac{e^{x_i}}{\sum_j e^{x_j}} = \dfrac{e^{x_i - m}}{\sum_j e^{x_j - m}} = e^{x_i - \operatorname{LSE}(\mathbf{x})}$.

:::nota[Qué significa cada símbolo]
- $x_1, \dots, x_n$: exponentes, por ejemplo logaritmos de probabilidades o puntuaciones.
- $n$: número de términos.
- $\operatorname{LSE}$: logaritmo de la suma de exponenciales.
- $m$: el mayor de los $x_i$.
- $\mathbf{x}$: vector de los $x_i$.
- $\operatorname{softmax}(\mathbf{x})_i$: peso normalizado del término $i$.
:::

## Cómo usar la visualización

Las barras son los pesos softmax $e^{x_i - m}/\sum_j e^{x_j - m}$ de cada entrada. La reproducción suma la misma constante $c$ a todas las entradas, de 50 en 50 hasta 1000. El encabezado escribe el cálculo directo y el desplazado con sus números, y las lecturas cuentan cuántas exponenciales directas se desbordan; las barras de esas entradas se pintan de rosa.

Mientras las entradas son menores que 709, los dos cálculos coinciden. Cuando una pasa de 709, el cálculo directo da infinito y el desplazado sigue dando el valor correcto. Las barras no cambian en todo el recorrido: sumar una constante no altera los pesos softmax.

## Ejemplo

Se calcula $\operatorname{LSE}(1000, 1001, 1002)$.

1. Directo: $e^{1000}$ ya excede el mayor número de precisión doble, así que la suma es infinita y el logaritmo también.
2. Con el máximo $m = 1002$: los exponentes desplazados son $-2$, $-1$ y $0$.
3. $e^{-2} + e^{-1} + e^{0} = 0.1353 + 0.3679 + 1 = 1.5032$.
4. $\operatorname{LSE} = 1002 + \log 1.5032 = 1002 + 0.4076 = 1002.4076$.
5. Los pesos softmax son $0.1353/1.5032 = 0.090$, $0.3679/1.5032 = 0.245$ y $1/1.5032 = 0.665$.

:::figura[Las entradas 1000, 1001 y 1002 parten desbordadas: la fórmula directa da infinito desde el primer cuadro y la desplazada da 1002.4076 más el desplazamiento; los pesos 0.090, 0.245 y 0.665 no cambian.]{componente="NumericsLab"}
```yaml
modo: logsumexp
valores: [1000, 1001, 1002]
```
:::

## Propiedades

- **Invariancia por traslación:** $\operatorname{LSE}(\mathbf{x} + c) = \operatorname{LSE}(\mathbf{x}) + c$, y los pesos softmax no cambian al sumar $c$ a todas las entradas.

:::figura[Las entradas 0, 0.5, 3 y 1: al sumarles la misma constante, de 0 hasta 1000, las barras de los pesos softmax se quedan quietas; solo el valor de LSE crece en la misma cantidad.]{componente="NumericsLab"}
```yaml
modo: logsumexp
valores: [0, 0.5, 3, 1]
```
:::

- **Cotas:** $m \le \operatorname{LSE}(\mathbf{x}) \le m + \log n$; LSE es un máximo suave.
- **Convexidad:** LSE es convexa y su gradiente es el vector softmax, $\nabla \operatorname{LSE}(\mathbf{x}) = \operatorname{softmax}(\mathbf{x})$.
- **Temperatura:** $\tau\,\operatorname{LSE}(\mathbf{x}/\tau) \to \max_i x_i$ cuando $\tau \to 0$.

## Errores comunes

- **Proteger solo contra el desbordamiento hacia arriba.** Con exponentes muy negativos, $e^{x_i}$ se redondea a 0 y el logaritmo da $-\infty$; restar el máximo corrige los dos casos.

:::figura[Las entradas $-1000$, $-1001$ y $-1002$: sus exponenciales se redondean a 0 y la fórmula directa da $-\infty$, mientras que la desplazada da $-999.5924$. Al sumarles constantes positivas la fórmula directa empieza a funcionar solo cuando las entradas se acercan a $-745$.]{componente="NumericsLab"}
```yaml
modo: logsumexp
valores: [-1000, -1001, -1002]
```
:::

- **Restar el mínimo en lugar del máximo.** Con el mínimo, los exponentes desplazados son positivos y pueden seguir desbordándose.
- **Calcular la softmax y después su logaritmo.** Si un peso se redondea a 0, el logaritmo es $-\infty$; para la log-softmax se usa directamente $x_i - \operatorname{LSE}(\mathbf{x})$.
- **Pensar que el truco aproxima.** La identidad es exacta; solo cambia el orden de las operaciones.

## Conexiones

Es una reformulación que mejora la [[estabilidad-numerica]] usando las propiedades de la [[funcion-exponencial-y-logaritmo-natural]], necesaria por los límites del rango de la [[representacion-de-punto-flotante]]. LSE es una función convexa, como las de las [[funciones-convexas-y-concavas]], y aparece como término de normalización en la entropía cruzada y en las funciones de pérdida de clasificación.

## Formulario

:::formula[Log-sum-exp estable]
$$
\log \sum_{i=1}^{n} e^{x_i} = m + \log \sum_{i=1}^{n} e^{x_i - m}, \qquad m = \max_i x_i
$$

- $x_i$: exponentes; $n$: número de términos; $m$: máximo.
:::

:::formula[Softmax y log-softmax]
$$
\operatorname{softmax}(\mathbf{x})_i = e^{x_i - \operatorname{LSE}(\mathbf{x})}, \qquad \log \operatorname{softmax}(\mathbf{x})_i = x_i - \operatorname{LSE}(\mathbf{x})
$$

- $\mathbf{x}$: vector de entradas; $\operatorname{LSE}$: log-sum-exp.
:::

:::formula[Cotas]
$$
m \le \operatorname{LSE}(\mathbf{x}) \le m + \log n
$$

- $m$: máximo de las entradas; $n$: número de entradas.
:::

:::formula[Límites de la precisión doble]
$$
e^{x} \text{ se desborda para } x > 709.78, \qquad e^{x} \text{ se anula para } x < -745.13
$$

- $x$: exponente; los límites salen del mayor y el menor número positivo de precisión doble.
:::
