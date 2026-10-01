---
id: funcion-error
titulo: Función error
titulo_en: Error function
alias:
  - erf
  - función de error de Gauss
  - función error complementaria
  - erfc
modulo: 0
submodulo: '0.4'
orden: 21
nivel: intermedio
prerrequisitos:
  - integrales-impropias
etiquetas:
  - funciones especiales
  - curva de Gauss
  - distribución normal
  - integrales
resumen: >
  La función error erf(x) es el área bajo la curva de Gauss e^(-t^2) entre 0 y x, escalada para que tienda
  a 1; no tiene fórmula elemental y da las probabilidades de la distribución normal.
formula: '\operatorname{erf}(x) = \frac{2}{\sqrt{\pi}}\int_0^{x} e^{-t^2}\,dt, \qquad \Phi(z) = \tfrac{1}{2}\Big[1 + \operatorname{erf}\big(\tfrac{z}{\sqrt{2}}\big)\Big]'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: acumulada
    funcion: gauss
    desde: 0
    hasta: 3
    escala: 1.1284
    nombre: erf
referencias:
  - clave: blitzstein-hwang
  - clave: casella-berger
publicado: true
---

## Intuición

La curva de Gauss $e^{-t^2}$ describe errores de medición, alturas de personas y muchas otras variables que se agrupan alrededor de un valor típico. Preguntar qué fracción de los casos cae dentro de cierta distancia del centro es preguntar por el área bajo esa curva. El problema es que la curva de Gauss no tiene una antiderivada que se pueda escribir con polinomios, exponenciales, logaritmos o funciones trigonométricas.

La solución es darle nombre a esa área. La función error acumula el área bajo $e^{-t^2}$ desde 0 hasta $x$, multiplicada por $\frac{2}{\sqrt{\pi}}$ para que el total, cuando $x$ crece sin límite, sea exactamente 1. Así, $\operatorname{erf}(x)$ es la probabilidad de que un error gaussiano adecuadamente escalado quede entre $-x$ y $x$. Se calcula con series o aproximaciones numéricas, igual que el seno o la exponencial.

## Definición

:::definicion[Función error]
$$
\operatorname{erf}(x) = \frac{2}{\sqrt{\pi}}\int_0^{x} e^{-t^2}\,dt, \qquad \operatorname{erfc}(x) = 1 - \operatorname{erf}(x).
$$
:::

:::teorema[Relación con la normal estándar]
Si $Z \sim \mathcal{N}(0, 1)$ y $\Phi$ es su función de distribución acumulada,
$$
\Phi(z) = \tfrac{1}{2}\Big[1 + \operatorname{erf}\Big(\frac{z}{\sqrt{2}}\Big)\Big], \qquad P(|Z| \le z) = \operatorname{erf}\Big(\frac{z}{\sqrt{2}}\Big).
$$
:::

:::nota[Qué significa cada símbolo]
- $\operatorname{erf}(x)$: función error.
- $\operatorname{erfc}(x)$: función error complementaria.
- $t$: variable de integración.
- $e^{-t^2}$: curva de Gauss sin normalizar.
- $\frac{2}{\sqrt{\pi}}$: constante que hace que $\operatorname{erf}(\infty) = 1$.
- $Z$: variable normal estándar; $\Phi$: su distribución acumulada.
- $z$: número de desviaciones estándar.
:::

## Cómo usar la visualización

Arriba se dibuja $\frac{2}{\sqrt{\pi}}e^{-t^2}$ y la reproducción rellena su área desde 0 hasta un $x$ que avanza. Abajo se traza $\operatorname{erf}(x)$, el área acumulada, con su recta tangente; su pendiente es la altura de la curva de arriba en ese punto.

Al principio el área crece casi en línea recta, porque la curva está cerca de su máximo. Hacia $x = 2$ la curva de arriba casi se ha apagado y $\operatorname{erf}$ se aplana cerca de 1. En $x = 3$ el valor es 0.99998: prácticamente toda el área está en $[0, 3]$.

## Ejemplo

Una máquina corta varillas con error normal de media 0 y desviación estándar $\sigma$. Se calcula la proporción de varillas con error menor que una desviación estándar.

1. Se busca $P(|Z| \le 1)$ con $Z \sim \mathcal{N}(0, 1)$.
2. Por la relación con la normal, $P(|Z| \le 1) = \operatorname{erf}\big(\tfrac{1}{\sqrt{2}}\big) = \operatorname{erf}(0.7071)$.
3. $\operatorname{erf}(0.7071) \approx 0.6827$: el 68.27 % de las varillas.
4. Con dos desviaciones: $\operatorname{erf}(\sqrt{2}) = \operatorname{erf}(1.4142) \approx 0.9545$.
5. En términos de área bajo $e^{-t^2}$: $\int_{-0.7071}^{0.7071}e^{-t^2}dt = \sqrt{\pi}\cdot 0.6827 \approx 1.210$.

:::figura[El área del ejemplo bajo e^(-t²) entre -0.7071 y 0.7071: vale aproximadamente 1.210, que dividida entre raíz de π da erf(0.7071) = 0.6827.]{componente="CalculusViz"}
```yaml
modo: area
funcion: gauss
intervalo: [-0.7071, 0.7071]
```
:::

## Propiedades

- **Impar:** $\operatorname{erf}(-x) = -\operatorname{erf}(x)$.
- **Límites:** $\operatorname{erf}(0) = 0$ y $\lim_{x \to \infty}\operatorname{erf}(x) = 1$, por la integral de Gauss.
- **Derivada:** $\operatorname{erf}'(x) = \frac{2}{\sqrt{\pi}}e^{-x^2}$.
- **Serie:** $\operatorname{erf}(x) = \frac{2}{\sqrt{\pi}}\sum_{n=0}^{\infty}\frac{(-1)^n x^{2n+1}}{n!\,(2n + 1)}$, útil para $x$ pequeño.
- **Cola:** para $x$ grande, $\operatorname{erfc}(x) \approx \frac{e^{-x^2}}{x\sqrt{\pi}}$.
- **Regla empírica:** $P(|Z| \le 1, 2, 3) \approx 0.683,\ 0.954,\ 0.997$.

:::demostracion
Serie: se integra término a término la serie de $e^{-t^2} = \sum_{n \ge 0}\frac{(-1)^n t^{2n}}{n!}$, lo cual es válido porque converge uniformemente en $[0, x]$: $\int_0^x t^{2n}dt = \frac{x^{2n+1}}{2n + 1}$.
:::

## Errores comunes

- **Olvidar el factor $\sqrt{2}$.** $\Phi(z)$ usa $\operatorname{erf}(z/\sqrt{2})$, no $\operatorname{erf}(z)$.
- **Confundir erf con la probabilidad de un solo lado.** $\operatorname{erf}$ da la probabilidad en un intervalo simétrico; la acumulada de un lado es $\Phi(z) = \tfrac{1}{2} + \tfrac{1}{2}\operatorname{erf}(z/\sqrt{2})$, donde $\Phi$ es la función de distribución normal estándar y $z$ el punto de corte.
- **Buscar una antiderivada elemental de $e^{-x^2}$.** No existe; por eso se definió la función error.
- **Restar números casi iguales en las colas.** Para $x$ grande conviene usar $\operatorname{erfc}$ directamente en lugar de $1 - \operatorname{erf}(x)$.

## Conexiones

La función error es la función área del [[teorema-fundamental-del-calculo]] aplicada a la curva de Gauss, y su valor límite es una [[integrales-impropias|integral impropia]]. Está relacionada con la [[funcion-gamma]] a través de $\Gamma(1/2) = \sqrt{\pi}$. En probabilidad expresa la función de distribución acumulada de la distribución normal y aparece en intervalos de confianza y en pruebas de hipótesis.

## Formulario

:::formula[Función error]
$$
\operatorname{erf}(x) = \frac{2}{\sqrt{\pi}}\int_0^{x} e^{-t^2}\,dt
$$

- $t$: variable de integración.
:::

:::formula[Complementaria]
$$
\operatorname{erfc}(x) = 1 - \operatorname{erf}(x) = \frac{2}{\sqrt{\pi}}\int_x^{\infty} e^{-t^2}\,dt
$$

- Mide el área de la cola.
:::

:::formula[Normal estándar]
$$
\Phi(z) = \tfrac{1}{2}\Big[1 + \operatorname{erf}\Big(\frac{z}{\sqrt{2}}\Big)\Big], \qquad P(|Z| \le z) = \operatorname{erf}\Big(\frac{z}{\sqrt{2}}\Big)
$$

- $Z \sim \mathcal{N}(0, 1)$.
:::

:::formula[Derivada]
$$
\frac{d}{dx}\operatorname{erf}(x) = \frac{2}{\sqrt{\pi}}\,e^{-x^2}
$$

- Por el teorema fundamental del cálculo.
:::
