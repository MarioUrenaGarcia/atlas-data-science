---
id: aproximacion-de-stirling
titulo: Aproximación de Stirling
titulo_en: Stirling's approximation
alias:
  - fórmula de Stirling
  - aproximación del factorial
modulo: 0
submodulo: '0.4'
orden: 22
nivel: intermedio
prerrequisitos:
  - funcion-gamma
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - factorial
  - aproximación asintótica
  - logaritmos
  - combinatoria
resumen: >
  Para n grande, n! es aproximadamente raíz de 2 pi n por (n/e)^n: el cociente entre ambos tiende a 1,
  aunque su diferencia crezca; en logaritmos, log n! es cercano a n log n - n.
formula: 'n! \sim \sqrt{2\pi n}\,\Big(\frac{n}{e}\Big)^{n}, \qquad \log n! = n\log n - n + \tfrac{1}{2}\log(2\pi n) + O\big(\tfrac{1}{n}\big)'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: stirling
    n: 3
referencias:
  - clave: ross-probabilidad
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Los factoriales crecen tan rápido que calcularlos directamente es impráctico: $60!$ tiene 82 cifras. Sin embargo, su comportamiento se describe con una fórmula sencilla. El factorial es un producto de $n$ números que van de 1 a $n$; su logaritmo es una suma de logaritmos, parecida al área bajo $\log x$ entre 1 y $n$, que vale $n\log n - n + 1$. De ahí sale que $n!$ se comporta como $(n/e)^n$.

La aproximación de Stirling afina esa idea con un factor de corrección, $\sqrt{2\pi n}$, y el resultado es asombrosamente preciso: el error relativo es de aproximadamente $\frac{1}{12n}$, menos del 1 % a partir de $n = 9$. Lo importante es que la precisión es relativa: la diferencia absoluta entre $n!$ y la aproximación crece sin límite, pero su cociente se acerca a 1. Por eso es la herramienta estándar para estimar coeficientes binomiales grandes y probabilidades en experimentos con muchos ensayos.

## Definición

:::teorema[Fórmula de Stirling]
$$
\lim_{n \to \infty}\frac{n!}{\sqrt{2\pi n}\,(n/e)^{n}} = 1,
$$
lo que se escribe $n! \sim \sqrt{2\pi n}\,(n/e)^{n}$. Con más precisión,
$$
n! = \sqrt{2\pi n}\,\Big(\frac{n}{e}\Big)^{n}\Big(1 + \frac{1}{12n} + O\Big(\frac{1}{n^{2}}\Big)\Big).
$$
:::

En logaritmos: $\log n! = n\log n - n + \tfrac{1}{2}\log(2\pi n) + O(1/n)$. La misma fórmula vale para la función gamma: $\Gamma(x + 1) \sim \sqrt{2\pi x}\,(x/e)^{x}$ cuando $x \to \infty$.

:::nota[Qué significa cada símbolo]
- $n!$: factorial de $n$.
- $e$: base del logaritmo natural, $\approx 2.71828$.
- $\sim$: "asintóticamente equivalente", el cociente tiende a 1.
- $O\big(\frac{1}{n^2}\big)$: término de orden $1/n^2$, despreciable para $n$ grande.
- $\log$: logaritmo natural.
- $\Gamma$: función gamma, con $\Gamma(n + 1) = n!$.
:::

## Cómo usar la visualización

Arriba se grafican $\log n!$ (puntos) y el logaritmo de la aproximación (curva) para $n$ de 1 a 60; abajo, el cociente $n!/\text{Stirling}$ con la línea de referencia en 1. El control fija $n$ y la reproducción lo recorre. El panel muestra ambos valores en notación científica y el error relativo.

En la escala logarítmica los puntos caen sobre la curva desde el principio. El cociente de abajo empieza en 1.084 para $n = 1$ y baja rápidamente: en $n = 10$ ya es 1.0083 y en $n = 60$ es 1.0014, siempre muy cerca de $1 + \frac{1}{12n}$.

## Ejemplo

Se estima $10!$ y el número de maneras de obtener exactamente 50 caras en 100 lanzamientos de una moneda.

1. Stirling: $\sqrt{2\pi\cdot 10}\,(10/e)^{10} = 7.9267 \cdot 453999.3 \approx 3598696$.
2. Valor exacto: $10! = 3628800$; el cociente es $1.00837$, cercano a $1 + \frac{1}{120} = 1.00833$.
3. Para $\binom{100}{50} = \frac{100!}{50!\,50!}$, Stirling da $\frac{\sqrt{2\pi\cdot100}\,(100/e)^{100}}{\big[\sqrt{2\pi\cdot50}\,(50/e)^{50}\big]^2} = \frac{2^{100}}{\sqrt{50\pi}}$.
4. Probabilidad de exactamente 50 caras: $\binom{100}{50}2^{-100} \approx \frac{1}{\sqrt{50\pi}} \approx 0.0798$.
5. El valor exacto es 0.0796: la aproximación falla en la tercera cifra.

:::figura[El ejemplo con n = 10: la aproximación de Stirling da 3598696 contra el valor exacto 3628800, un error relativo de 0.84 %.]{componente="CalculusViz"}
```yaml
modo: stirling
n: 10
```
:::

## Propiedades

- **Error relativo:** $\frac{n!}{\text{Stirling}} - 1 \approx \frac{1}{12n}$, así que el error cae como $1/n$.
- **Cotas:** para todo $n \ge 1$, $\sqrt{2\pi n}(n/e)^n\,e^{1/(12n+1)} < n! < \sqrt{2\pi n}(n/e)^n\,e^{1/(12n)}$.
- **Forma logarítmica simple:** $\log n! \approx n\log n - n$, suficiente cuando solo importa el orden de magnitud.
- **Coeficiente binomial central:** $\binom{2n}{n} \sim \frac{4^{n}}{\sqrt{\pi n}}$.
- **Entropía:** $\log\binom{n}{k} \approx n\,H(k/n)$, con $H(p) = -p\log p - (1 - p)\log(1 - p)$, conecta el conteo con la teoría de la información.

:::figura[Caso del crecimiento del factorial en escala logarítmica: n! crece más rápido que la exponencial 2^n pero más lento que n^n, y la curva de Stirling lo sigue de cerca.]{componente="CombinatoricsBoard"}
```yaml
modo: crecimiento
nMax: 20
```
:::

:::demostracion
Idea de la parte principal: $\log n! = \sum_{k=1}^{n}\log k$ está entre $\int_1^{n}\log x\,dx$ y $\int_1^{n+1}\log x\,dx$, porque $\log$ es creciente. Como $\int_1^{n}\log x\,dx = n\log n - n + 1$, se obtiene $\log n! = n\log n - n + O(\log n)$. El factor $\sqrt{2\pi n}$ requiere un análisis más fino, por ejemplo con el método de Laplace aplicado a la integral de la función gamma.
:::

## Errores comunes

- **Pensar que la diferencia se hace pequeña.** $n! - \text{Stirling}$ crece sin límite; lo que tiende a cero es el error relativo.
- **Olvidar el factor $\sqrt{2\pi n}$.** Sin él, $(n/e)^n$ subestima $n!$ por un factor que crece con $n$.
- **Usar la forma simple para probabilidades.** $n\log n - n$ ignora términos que no se cancelan en cocientes y puede dar probabilidades con error grande.
- **Aplicarla con $n$ pequeño esperando exactitud.** Para $n = 1$ el error es de 8 %.

## Conexiones

La aproximación describe el crecimiento del [[factorial]] y de la [[funcion-gamma]], y se deduce comparando la suma de [[funcion-exponencial-y-logaritmo-natural|logaritmos]] con una integral. Es la herramienta para estimar [[coeficiente-binomial|coeficientes binomiales]] grandes; de ella se obtiene la aproximación normal de la distribución binomial y la relación entre conteo y entropía.

## Formulario

:::formula[Fórmula de Stirling]
$$
n! \sim \sqrt{2\pi n}\,\Big(\frac{n}{e}\Big)^{n}
$$

- $\sim$: el cociente tiende a 1.
:::

:::formula[Con corrección]
$$
n! = \sqrt{2\pi n}\,\Big(\frac{n}{e}\Big)^{n}\Big(1 + \frac{1}{12n} + O(n^{-2})\Big)
$$

- $\frac{1}{12n}$: error relativo principal.
:::

:::formula[Forma logarítmica]
$$
\log n! = n\log n - n + \tfrac{1}{2}\log(2\pi n) + O\big(\tfrac{1}{n}\big)
$$

- $\log$: logaritmo natural.
:::

:::formula[Coeficiente binomial central]
$$
\binom{2n}{n} \sim \frac{4^{n}}{\sqrt{\pi n}}
$$

- Útil para probabilidades de empates en muchos ensayos.
:::
