---
id: funcion-beta
titulo: Función beta
titulo_en: Beta function
alias:
  - integral de Euler de primera especie
  - B(a, b)
modulo: 0
submodulo: '0.4'
orden: 20
nivel: intermedio
prerrequisitos:
  - funcion-gamma
etiquetas:
  - funciones especiales
  - integrales
  - distribución beta
  - gamma
resumen: >
  La función beta B(a, b) es el área bajo t^(a-1)(1-t)^(b-1) en [0, 1]; es simétrica en a y b y se
  expresa con la función gamma como Gamma(a) Gamma(b) / Gamma(a + b).
formula: 'B(a, b) = \int_0^1 t^{a-1}(1 - t)^{b-1}\,dt = \frac{\Gamma(a)\,\Gamma(b)}{\Gamma(a + b)}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: beta
    a: 0.5
    b: 0.5
referencias:
  - clave: casella-berger
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En el intervalo $[0, 1]$, la curva $t^{a-1}(1 - t)^{b-1}$ tiene una forma que controlan dos perillas. El exponente $a$ decide cómo se comporta cerca de 0 y el exponente $b$ cómo se comporta cerca de 1: exponentes mayores que 1 aplastan la curva contra ese extremo, exponentes menores que 1 la hacen dispararse ahí. Con $a$ y $b$ iguales la curva es simétrica; con $a$ mayor, la masa se corre hacia la derecha.

La función beta es el área total bajo esa curva. Su papel más importante es servir de constante de normalización: dividir la curva entre su área la convierte en la densidad de la distribución beta, que modela proporciones como la tasa de aciertos de un jugador o la fracción de clientes que compran. Y, sorprendentemente, esa área se puede calcular con tres valores de la función gamma.

## Definición

:::definicion[Función beta]
Para $a > 0$ y $b > 0$,
$$
B(a, b) = \int_0^1 t^{a-1}(1 - t)^{b-1}\,dt.
$$
:::

:::teorema[Relación con la gamma]
$$
B(a, b) = \frac{\Gamma(a)\,\Gamma(b)}{\Gamma(a + b)}.
$$
En particular, para enteros positivos $B(m, n) = \frac{(m - 1)!\,(n - 1)!}{(m + n - 1)!}$.
:::

:::nota[Qué significa cada símbolo]
- $a, b$: parámetros positivos que controlan la forma cerca de 0 y de 1.
- $t$: variable de integración en $[0, 1]$.
- $t^{a-1}(1 - t)^{b-1}$: integrando.
- $\Gamma$: función gamma.
- $m, n$: enteros positivos.
:::

## Cómo usar la visualización

Los dos controles fijan $a$ y $b$. La curva se dibuja en $[0, 1]$ y la reproducción rellena su área de izquierda a derecha. El encabezado y el panel comparan el área, $B(a, b)$, con el cociente de funciones gamma y con $B(b, a)$.

Con $a = b = 0.5$ la curva tiene forma de U y se dispara en ambos extremos, aunque su área es finita e igual a $\pi$. Al subir ambos parámetros a 3 la curva se vuelve una joroba centrada. Intercambiar $a$ y $b$ refleja la curva respecto a $t = 0.5$ y deja el área igual.

## Ejemplo

Un modelo de la tasa de conversión de una tienda en línea usa la curva $t^{1}(1 - t)^{2}$, es decir, $a = 2$ y $b = 3$.

1. Directamente: $\int_0^1 t(1 - t)^2 dt = \int_0^1 (t - 2t^2 + t^3)\,dt = \tfrac{1}{2} - \tfrac{2}{3} + \tfrac{1}{4} = \tfrac{1}{12}$.
2. Con la gamma: $B(2, 3) = \frac{\Gamma(2)\Gamma(3)}{\Gamma(5)} = \frac{1! \cdot 2!}{4!} = \frac{2}{24} = \frac{1}{12}$.
3. La densidad beta correspondiente es $12\,t(1 - t)^2$ en $[0, 1]$.
4. Su media es $\frac{a}{a + b} = \frac{2}{5} = 0.4$: una conversión típica del 40 %.
5. El máximo de la curva está en $t = \frac{a - 1}{a + b - 2} = \frac{1}{3}$.

:::figura[La curva del ejemplo, t(1 - t)², con a = 2 y b = 3: su área es 1/12 ≈ 0.0833 y su masa se inclina hacia la izquierda.]{componente="CalculusViz"}
```yaml
modo: beta
a: 2
b: 3
```
:::

## Propiedades

- **Simetría:** $B(a, b) = B(b, a)$.
- **Recurrencia:** $B(a + 1, b) = \frac{a}{a + b}\,B(a, b)$.
- **Casos simples:** $B(1, 1) = 1$, $B(a, 1) = \frac{1}{a}$ y $B\big(\tfrac{1}{2}, \tfrac{1}{2}\big) = \pi$.
- **Distribución beta:** $p(t) = \frac{t^{a-1}(1 - t)^{b-1}}{B(a, b)}$ en $[0, 1]$, con media $\frac{a}{a + b}$.
- **Coeficientes binomiales:** $\binom{n}{k} = \frac{1}{(n + 1)\,B(n - k + 1,\ k + 1)}$.

:::figura[Caso con la masa cargada a la derecha: con a = 5 y b = 2 la curva crece hasta cerca de 1 y cae bruscamente; es la reflexión de la curva con a = 2 y b = 5.]{componente="CalculusViz"}
```yaml
modo: beta
a: 5
b: 2
```
:::

:::demostracion
Simetría: con la sustitución $s = 1 - t$, $\int_0^1 t^{a-1}(1 - t)^{b-1}dt = \int_0^1 (1 - s)^{a-1}s^{b-1}ds = B(b, a)$.
:::

## Errores comunes

- **Olvidar restar 1 en los exponentes.** $B(2, 3)$ integra $t^{1}(1 - t)^{2}$, no $t^2(1 - t)^3$.
- **Confundir la función beta con la distribución beta.** La función es un número; la distribución es una densidad normalizada por ese número.
- **Creer que con $a < 1$ el área es infinita.** La curva no está acotada cerca de 0, pero su área es finita mientras $a > 0$.
- **Calcular con factoriales en valores no enteros.** Para $a$ o $b$ no enteros se usa la función gamma.

## Conexiones

La función beta se expresa con la [[funcion-gamma]] y su definición es una [[integrales-impropias|integral impropia]] cuando algún parámetro es menor que 1. Se relaciona con el [[coeficiente-binomial]] y es la constante de normalización de la distribución beta, que en estadística bayesiana es la distribución a priori conjugada para proporciones.

## Formulario

:::formula[Definición]
$$
B(a, b) = \int_0^1 t^{a-1}(1 - t)^{b-1}\,dt
$$

- $a, b > 0$: parámetros de forma.
:::

:::formula[Relación con la gamma]
$$
B(a, b) = \frac{\Gamma(a)\,\Gamma(b)}{\Gamma(a + b)}
$$

- $\Gamma$: función gamma.
:::

:::formula[Simetría y recurrencia]
$$
B(a, b) = B(b, a), \qquad B(a + 1, b) = \frac{a}{a + b}\,B(a, b)
$$

- Útiles para calcular sin integrar.
:::

:::formula[Densidad beta y su media]
$$
p(t) = \frac{t^{a-1}(1 - t)^{b-1}}{B(a, b)}, \qquad \mathbb{E}[T] = \frac{a}{a + b}
$$

- $T$: variable aleatoria con distribución beta.
:::
