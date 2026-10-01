---
id: funcion-gamma
titulo: Función gamma
titulo_en: Gamma function
alias:
  - gamma de Euler
  - factorial generalizado
modulo: 0
submodulo: '0.4'
orden: 19
nivel: intermedio
prerrequisitos:
  - integrales-impropias
  - integracion-por-partes
  - factorial
etiquetas:
  - funciones especiales
  - factorial
  - integrales
  - distribución gamma
resumen: >
  La función gamma extiende el factorial a los números reales positivos: es el área bajo t^(x-1) e^(-t),
  cumple Gamma(x+1) = x Gamma(x) y vale (n-1)! en los enteros positivos.
formula: '\Gamma(x) = \int_0^{\infty} t^{x-1}e^{-t}\,dt, \qquad \Gamma(x + 1) = x\,\Gamma(x), \qquad \Gamma(n) = (n - 1)!'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: gamma
    x: 2.5
referencias:
  - clave: casella-berger
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

El factorial $n! = 1 \cdot 2 \cdots n$ solo tiene sentido para enteros, pero en probabilidad y estadística aparecen expresiones como "3.5 factorial" o "la mitad factorial". La función gamma es la forma natural de rellenar los huecos: una curva suave que pasa por todos los factoriales y cumple la misma regla de recurrencia que ellos.

Se construye como un área. Para cada $x$, la curva $t^{x-1}e^{-t}$ empieza creciendo como una potencia y termina apagándose como una exponencial; el área total bajo ella es $\Gamma(x)$. Al aumentar $x$ en 1, integrar por partes muestra que el área se multiplica por $x$, igual que $n! = n \cdot (n - 1)!$. Con esa regla y el valor $\Gamma(1) = 1$, la curva queda anclada en los factoriales: $\Gamma(n) = (n - 1)!$. Aparece en las constantes de las distribuciones gamma, beta, chi cuadrada y t de Student.

## Definición

:::definicion[Función gamma]
Para $x > 0$,
$$
\Gamma(x) = \int_0^{\infty} t^{x-1}e^{-t}\,dt.
$$
La integral impropia converge para todo $x > 0$: cerca de 0 el integrando se comporta como $t^{x-1}$ y en el infinito la exponencial domina.
:::

:::teorema[Propiedades fundamentales]
$\Gamma(1) = 1$, $\ \Gamma(x + 1) = x\,\Gamma(x)$, y en consecuencia $\Gamma(n) = (n - 1)!$ para todo entero $n \ge 1$. Además $\Gamma\big(\tfrac{1}{2}\big) = \sqrt{\pi}$.
:::

:::nota[Qué significa cada símbolo]
- $\Gamma(x)$: función gamma evaluada en $x$.
- $x$: argumento real positivo.
- $t$: variable de integración.
- $t^{x-1}e^{-t}$: integrando, que determina la forma de la curva.
- $n$: entero positivo.
- $(n - 1)!$: factorial de $n - 1$.
:::

## Cómo usar la visualización

Arriba se dibuja el integrando $t^{x-1}e^{-t}$ con su área sombreada, que es $\Gamma(x)$. Abajo aparece la curva $\Gamma(x)$ con los factoriales marcados en los enteros y un círculo en el valor actual. El control fija $x$ y la reproducción lo recorre de 0.3 a 5.

Al pasar $x$ por un entero, el círculo de abajo cae sobre un punto amarillo: $\Gamma(4) = 3! = 6$. Para $x < 1$ el integrando se dispara cerca de 0 pero el área sigue siendo finita. El pico del integrando está en $t = x - 1$, así que se desplaza a la derecha al crecer $x$.

## Ejemplo

En la distribución normal aparece la constante $\sqrt{\pi}$, que se obtiene como $\Gamma(\frac{1}{2})$.

1. $\Gamma\big(\tfrac{1}{2}\big) = \int_0^{\infty} t^{-1/2}e^{-t}dt$.
2. Con la sustitución $t = u^2$, $dt = 2u\,du$: $\int_0^{\infty} u^{-1}e^{-u^2}\,2u\,du = 2\int_0^{\infty}e^{-u^2}du$.
3. La integral de Gauss da $\int_0^{\infty}e^{-u^2}du = \frac{\sqrt{\pi}}{2}$, así que $\Gamma\big(\tfrac{1}{2}\big) = \sqrt{\pi} \approx 1.7725$.
4. Con la recurrencia: $\Gamma\big(\tfrac{3}{2}\big) = \tfrac{1}{2}\sqrt{\pi} \approx 0.8862$ y $\Gamma\big(\tfrac{5}{2}\big) = \tfrac{3}{2}\cdot\tfrac{1}{2}\sqrt{\pi} \approx 1.3293$.
5. Comparación con los enteros vecinos: $\Gamma(2) = 1$ y $\Gamma(3) = 2$, y $\Gamma(2.5)$ queda entre ellos.

:::figura[El valor del ejemplo, Γ(1/2): el integrando t^(-1/2) e^(-t) no está acotado cerca de 0, pero su área es finita e igual a raíz de π.]{componente="CalculusViz"}
```yaml
modo: gamma
x: 0.5
```
:::

## Propiedades

- **Recurrencia:** $\Gamma(x + 1) = x\,\Gamma(x)$ para todo $x > 0$.
- **Factoriales:** $\Gamma(n + 1) = n!$.
- **Mínimo:** en los positivos, $\Gamma$ alcanza su mínimo cerca de $x \approx 1.4616$, con valor $\approx 0.8856$.
- **Crecimiento:** crece más rápido que cualquier exponencial; su logaritmo, $\log\Gamma(x)$, es convexo.
- **Reflexión:** $\Gamma(x)\,\Gamma(1 - x) = \frac{\pi}{\operatorname{sen}(\pi x)}$ para $0 < x < 1$.
- **Relación con la beta:** $B(a, b) = \frac{\Gamma(a)\Gamma(b)}{\Gamma(a + b)}$.

:::figura[Caso de un argumento entero: con x = 4 el área bajo t³ e^(-t) es 6 = 3!, y el círculo de la curva Γ coincide con el punto del factorial.]{componente="CalculusViz"}
```yaml
modo: gamma
x: 4
```
:::

:::demostracion
Recurrencia: por partes con $u = t^{x}$ y $dv = e^{-t}dt$, $\Gamma(x + 1) = \big[-t^{x}e^{-t}\big]_0^{\infty} + x\int_0^{\infty}t^{x-1}e^{-t}dt = 0 + x\,\Gamma(x)$. Con $\Gamma(1) = \int_0^\infty e^{-t}dt = 1$, por inducción $\Gamma(n) = (n - 1)!$.
:::

## Errores comunes

- **Olvidar el desfase de uno.** $\Gamma(n) = (n - 1)!$, no $n!$.
- **Evaluar en $x \le 0$ con la integral.** La integral diverge para $x \le 0$; la función se extiende a negativos no enteros por otros medios y tiene polos en $0, -1, -2, \dots$.
- **Calcular $\Gamma$ de números grandes directamente.** Desborda rápidamente; en la práctica se trabaja con $\log\Gamma$.
- **Confundir la función gamma con la distribución gamma.** La distribución usa la función como constante de normalización.

## Conexiones

La función gamma es una [[integrales-impropias|integral impropia]] cuya recurrencia se obtiene con [[integracion-por-partes]], y extiende el [[factorial]]. Define la [[funcion-beta]] y la [[aproximacion-de-stirling]] describe su crecimiento. En probabilidad es la constante de normalización de las distribuciones gamma, chi cuadrada, beta, t de Student y Dirichlet.

## Formulario

:::formula[Definición]
$$
\Gamma(x) = \int_0^{\infty} t^{x-1}e^{-t}\,dt, \quad x > 0
$$

- $t$: variable de integración.
:::

:::formula[Recurrencia y factoriales]
$$
\Gamma(x + 1) = x\,\Gamma(x), \qquad \Gamma(n) = (n - 1)!
$$

- $n$: entero positivo.
:::

:::formula[Valores especiales]
$$
\Gamma(1) = 1, \qquad \Gamma\big(\tfrac{1}{2}\big) = \sqrt{\pi}
$$

- $\pi \approx 3.14159$.
:::

:::formula[Fórmula de reflexión]
$$
\Gamma(x)\,\Gamma(1 - x) = \frac{\pi}{\operatorname{sen}(\pi x)}
$$

- $0 < x < 1$.
:::
