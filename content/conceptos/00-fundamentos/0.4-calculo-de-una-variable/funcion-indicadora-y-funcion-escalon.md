---
id: funcion-indicadora-y-funcion-escalon
titulo: Función indicadora y función escalón
titulo_en: Indicator function and step function
alias:
  - función indicadora
  - función característica de un conjunto
  - función de Heaviside
  - escalón unitario
modulo: 0
submodulo: '0.4'
orden: 24
nivel: basico
prerrequisitos:
  - integral-definida-como-area
etiquetas:
  - indicadora
  - escalón
  - Heaviside
  - conteo
resumen: >
  La indicadora de un conjunto vale 1 dentro y 0 fuera; la función escalón de Heaviside es la indicadora
  de los no negativos. Sumar indicadoras cuenta, e integrarlas mide longitudes.
formula: '\mathbf{1}_A(x) = \begin{cases} 1 & x \in A \\ 0 & x \notin A \end{cases}, \qquad H(x) = \mathbf{1}\{x \ge 0\}, \qquad \mathbf{1}_{[a, b)}(x) = H(x - a) - H(x - b)'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: indicadora
    intervalos: [[-1, 1], [2, 3.5]]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una función indicadora responde una pregunta de sí o no con un número: vale 1 si el valor pertenece a cierto conjunto y 0 si no. Es un interruptor. La función escalón de Heaviside es el caso más simple: vale 0 para los negativos y 1 a partir de cero, como un interruptor que se enciende en un instante y ya no se apaga.

Convertir preguntas en números tiene consecuencias útiles. Sumar indicadoras cuenta cuántos casos cumplen una condición: el número de clientes que gastaron más de 500 pesos es la suma, sobre todos los clientes, de la indicadora de "gastó más de 500". Integrar una indicadora mide la longitud del conjunto. Y la probabilidad de un evento es el valor esperado de su indicadora. Los intervalos se construyen restando escalones: encender en $a$ y apagar en $b$.

## Definición

:::definicion[Indicadora y escalón]
Para un conjunto $A \subseteq \mathbb{R}$, la **función indicadora** es
$$
\mathbf{1}_A(x) = \begin{cases} 1 & \text{si } x \in A, \\ 0 & \text{si } x \notin A, \end{cases}
$$
también escrita $\mathbf{1}\{x \in A\}$. La **función escalón de Heaviside** es $H(x) = \mathbf{1}\{x \ge 0\}$.
:::

:::teorema[Operaciones]
$\mathbf{1}_{A \cap B} = \mathbf{1}_A\,\mathbf{1}_B$, $\ \mathbf{1}_{A^c} = 1 - \mathbf{1}_A$, $\ \mathbf{1}_{A \cup B} = \mathbf{1}_A + \mathbf{1}_B - \mathbf{1}_A\mathbf{1}_B$, y para $a < b$, $\mathbf{1}_{[a, b)}(x) = H(x - a) - H(x - b)$.
:::

:::nota[Qué significa cada símbolo]
- $A, B$: subconjuntos de la recta real.
- $\mathbf{1}_A$: indicadora de $A$.
- $\mathbf{1}\{\cdot\}$: indicadora de una condición.
- $H$: escalón de Heaviside.
- $A^c$: complemento de $A$.
- $[a, b)$: intervalo que incluye $a$ y excluye $b$.
:::

## Cómo usar la visualización

El conjunto $A$ está formado por dos intervalos cerrados, sombreados. La línea azul es $\mathbf{1}_A$, con círculos llenos donde vale 1 en los extremos y vacíos donde el valor 0 no se alcanza. Las líneas punteadas son los escalones $H$ que encienden y apagan el primer intervalo. La reproducción recorre la recta con un punto que lee el valor de la indicadora; el panel muestra si el punto pertenece a $A$ y la integral de la indicadora.

La integral, 3.5, coincide con la suma de las longitudes 2 y 1.5. Al cruzar cada extremo el punto salta de nivel sin pasar por valores intermedios: la indicadora de un intervalo es discontinua exactamente en sus extremos.

## Ejemplo

Una tienda registra los montos de cinco compras: 120, 480, 650, 90 y 710 pesos. Se usan indicadoras para contar y medir.

1. Indicadora del conjunto $A = [500, \infty)$: $\mathbf{1}_A(x_i) = 0, 0, 1, 0, 1$.
2. Número de compras de al menos 500 pesos: $\sum_i \mathbf{1}_A(x_i) = 2$.
3. Proporción: $\frac{1}{5}\sum_i \mathbf{1}_A(x_i) = 0.4$, que estima $P(X \ge 500) = \mathbb{E}[\mathbf{1}_A(X)]$.
4. La indicadora del intervalo $[0, 2]$ integra $\int \mathbf{1}_{[0,2]}(x)\,dx = 2$, su longitud.
5. Con escalones: $\mathbf{1}_{[0,2)}(x) = H(x) - H(x - 2)$; en $x = 1$ vale $1 - 0 = 1$ y en $x = 3$ vale $1 - 1 = 0$.

:::figura[La indicadora del intervalo [0, 2] del ejemplo: vale 1 dentro y 0 fuera, y su integral es la longitud del intervalo, 2.]{componente="CalculusViz"}
```yaml
modo: indicadora
intervalos: [[0, 2]]
```
:::

## Propiedades

- **Conteo:** $\sum_{i=1}^{n}\mathbf{1}_A(x_i) = \#\{i : x_i \in A\}$.
- **Medida:** $\int \mathbf{1}_A(x)\,dx$ es la longitud total de $A$.
- **Probabilidad:** $\mathbb{E}[\mathbf{1}_A(X)] = P(X \in A)$.
- **Idempotencia:** $\mathbf{1}_A^2 = \mathbf{1}_A$, porque $0^2 = 0$ y $1^2 = 1$.
- **Discontinuidad:** $H$ es discontinua en 0, con salto de 0 a 1; su derivada es 0 fuera de 0.
- **Distribución empírica:** $\hat{F}(x) = \frac{1}{n}\sum_i H(x - x_i)$ es una escalera que sube $\frac{1}{n}$ en cada dato.

:::figura[Caso del escalón con un salto: la función H(x) + x/2 sube de golpe una unidad en x = 0; los límites laterales son distintos y el valor en 0 coincide con el de la derecha.]{componente="CalculusViz"}
```yaml
modo: limite
casos: [salto]
```
:::

:::demostracion
Unión: $\mathbf{1}_A + \mathbf{1}_B - \mathbf{1}_A\mathbf{1}_B$ vale 0 si $x$ no está en ninguno, 1 si está en exactamente uno ($1 + 0 - 0$), y 1 si está en ambos ($1 + 1 - 1$). Coincide con $\mathbf{1}_{A \cup B}$ en todos los casos.
:::

## Errores comunes

- **Olvidar el convenio en los extremos.** $H(0)$ vale 1 con la convención $H(x) = \mathbf{1}\{x \ge 0\}$, pero algunos textos usan $\tfrac{1}{2}$; conviene declararlo.
- **Sumar indicadoras de conjuntos que se traslapan esperando otra indicadora.** $\mathbf{1}_A + \mathbf{1}_B$ vale 2 en la intersección.
- **Confundir la indicadora con la función característica de probabilidad.** En probabilidad, "función característica" también designa la transformada $\mathbb{E}[e^{itX}]$, algo distinto.
- **Derivar el escalón como si fuera suave.** Su derivada no existe en 0 en el sentido usual.

## Conexiones

La indicadora formaliza la pertenencia a [[conjuntos-y-notacion|conjuntos]], y sus propiedades de unión reproducen el [[principio-de-inclusion-y-exclusion]]. El escalón es el ejemplo típico de discontinuidad de salto en [[continuidad]], e integrar indicadoras mide longitudes como en [[integral-definida-como-area]]. En probabilidad, las variables indicadoras convierten probabilidades en esperanzas, y la función de distribución empírica es una suma de escalones.

## Formulario

:::formula[Indicadora]
$$
\mathbf{1}_A(x) = \begin{cases} 1 & x \in A \\ 0 & x \notin A \end{cases}
$$

- $A$: conjunto.
:::

:::formula[Escalón e intervalos]
$$
H(x) = \mathbf{1}\{x \ge 0\}, \qquad \mathbf{1}_{[a, b)}(x) = H(x - a) - H(x - b)
$$

- $a < b$: extremos del intervalo.
:::

:::formula[Conteo, medida y probabilidad]
$$
\sum_{i} \mathbf{1}_A(x_i) = \#\{i : x_i \in A\}, \qquad \int \mathbf{1}_A = \operatorname{long}(A), \qquad \mathbb{E}[\mathbf{1}_A(X)] = P(X \in A)
$$

- $\#$: número de elementos; $\operatorname{long}$: longitud total.
:::

:::formula[Operaciones]
$$
\mathbf{1}_{A \cap B} = \mathbf{1}_A\mathbf{1}_B, \qquad \mathbf{1}_{A^c} = 1 - \mathbf{1}_A, \qquad \mathbf{1}_{A \cup B} = \mathbf{1}_A + \mathbf{1}_B - \mathbf{1}_A\mathbf{1}_B
$$

- $A^c$: complemento de $A$.
:::
