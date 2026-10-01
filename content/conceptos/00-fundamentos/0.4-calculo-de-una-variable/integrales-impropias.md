---
id: integrales-impropias
titulo: Integrales impropias
titulo_en: Improper integrals
alias:
  - integral impropia
  - integral en un intervalo infinito
  - convergencia de integrales
modulo: 0
submodulo: '0.4'
orden: 18
nivel: basico
prerrequisitos:
  - teorema-fundamental-del-calculo
etiquetas:
  - integrales
  - convergencia
  - intervalos infinitos
  - singularidades
resumen: >
  Una integral impropia tiene un límite infinito o un integrando no acotado; se define como el límite de
  integrales ordinarias y converge si ese límite es finito.
formula: '\int_a^{\infty} f(x)\,dx = \lim_{b \to \infty}\int_a^{b} f(x)\,dx, \qquad \int_0^1 \frac{dx}{x^p} < \infty \iff p < 1'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: impropia
    casos: [inverso-cuadrado, reciproca, exponencial, inverso-raiz, reciproca-singular]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una región infinitamente larga puede tener área finita. La región bajo $\frac{1}{x^2}$ desde 1 hasta el infinito nunca termina, pero se adelgaza tan rápido que, por más lejos que se mida, el área nunca pasa de 1. En cambio, bajo $\frac{1}{x}$ la región se adelgaza más despacio y el área crece sin cota, aunque muy lentamente.

Para decidir entre ambos casos se calcula el área hasta un límite finito $b$ y se observa qué pasa al alejar $b$: si las áreas se estabilizan, la integral converge a ese valor; si crecen sin parar, diverge. La misma idea sirve cuando el problema no es la longitud sino la altura, como en $\frac{1}{\sqrt{x}}$ cerca de 0. Todas las distribuciones de probabilidad continuas sobre la recta completa dependen de integrales impropias que convergen a 1.

## Definición

:::definicion[Integrales impropias]
**Intervalo infinito:** si $f$ es continua en $[a, \infty)$,
$$
\int_a^{\infty} f(x)\,dx = \lim_{b \to \infty}\int_a^{b} f(x)\,dx.
$$
**Integrando no acotado:** si $f$ es continua en $(a, b]$ y no acotada cerca de $a$,
$$
\int_a^{b} f(x)\,dx = \lim_{\varepsilon \to 0^+}\int_{a+\varepsilon}^{b} f(x)\,dx.
$$
La integral **converge** si el límite existe y es finito, y **diverge** en otro caso. $\int_{-\infty}^{\infty} f$ converge si convergen $\int_{-\infty}^{c} f$ y $\int_c^{\infty} f$ por separado.
:::

:::nota[Qué significa cada símbolo]
- $f$: función integrada.
- $a$: extremo finito del intervalo.
- $b$: límite superior móvil que tiende a infinito.
- $\varepsilon$: distancia móvil al punto donde $f$ no está acotada.
- $\infty$: indica que el intervalo no tiene fin.
- $c$: punto intermedio para partir una integral sobre toda la recta.
:::

## Cómo usar la visualización

El selector elige una integral impropia. La reproducción mueve el límite: $b$ se aleja multiplicándose en cada paso, o $\varepsilon$ se acerca a 0 dividiéndose. El área sombreada y el panel muestran la integral hasta ese límite y el valor final, o el aviso de divergencia.

Con $\frac{1}{x^2}$ las áreas se detienen cerca de 1 aunque $b$ llegue a miles. Con $\frac{1}{x}$ cada vez que $b$ se multiplica por 1.5 el área crece en la misma cantidad, $\log 1.5$, así que nunca se estabiliza. Con $\frac{1}{\sqrt{x}}$ en $(0, 1]$ la región es infinitamente alta pero su área tiende a 2.

## Ejemplo

El tiempo de vida de un componente electrónico tiene densidad $p(t) = e^{-t}$ para $t \ge 0$ (en años). Se verifica que es una densidad válida.

1. $\int_0^b e^{-t}\,dt = \big[-e^{-t}\big]_0^b = 1 - e^{-b}$.
2. Con $b = 1$: 0.632; con $b = 3$: 0.950; con $b = 10$: 0.99995.
3. $\lim_{b \to \infty}(1 - e^{-b}) = 1$: la integral converge y el área total es 1.
4. La probabilidad de que dure más de 2 años es $\int_2^{\infty}e^{-t}dt = e^{-2} \approx 0.135$.
5. Su vida media es $\int_0^{\infty} t\,e^{-t}dt = 1$ año, otra integral impropia convergente.

:::figura[La densidad del componente del ejemplo: el área bajo e^(-x) desde 0 hasta b se acerca a 1 conforme b crece.]{componente="CalculusViz"}
```yaml
modo: impropia
casos: [exponencial]
```
:::

## Propiedades

- **Criterio de las potencias en el infinito:** $\int_1^{\infty}\frac{dx}{x^p}$ converge si y solo si $p > 1$, y vale $\frac{1}{p - 1}$.
- **Criterio de las potencias en cero:** $\int_0^1 \frac{dx}{x^p}$ converge si y solo si $p < 1$, y vale $\frac{1}{1 - p}$.
- **Comparación:** si $0 \le f \le g$ y $\int g$ converge, $\int f$ converge; si $\int f$ diverge, $\int g$ diverge.
- **Convergencia absoluta:** si $\int |f|$ converge, $\int f$ converge.
- **Exponenciales:** $\int_0^{\infty}x^n e^{-x}dx = n!$ para todo entero $n \ge 0$: la exponencial vence a cualquier potencia.
- **Integral de Gauss:** $\int_{-\infty}^{\infty}e^{-x^2}dx = \sqrt{\pi}$.

:::figura[Caso divergente con singularidad: el área bajo 1/x entre ε y 1 crece sin cota conforme ε se acerca a 0, al contrario que 1/raíz de x.]{componente="CalculusViz"}
```yaml
modo: impropia
casos: [reciproca-singular]
```
:::

:::demostracion
Criterio en el infinito: para $p \neq 1$, $\int_1^{b}x^{-p}dx = \frac{b^{1-p} - 1}{1 - p}$. Si $p > 1$, $b^{1-p} \to 0$ y el límite es $\frac{1}{p - 1}$; si $p < 1$, $b^{1-p} \to \infty$. Para $p = 1$, $\int_1^b \frac{dx}{x} = \log b \to \infty$.
:::

## Errores comunes

- **Ignorar una singularidad dentro del intervalo.** $\int_{-1}^{1}\frac{dx}{x^2}$ no es $-2$: el integrando explota en 0 y la integral diverge.
- **Usar límites simétricos para decidir.** $\int_{-\infty}^{\infty}x\,dx$ diverge aunque $\lim_{b \to \infty}\int_{-b}^{b}x\,dx = 0$.
- **Pensar que si $f(x) \to 0$ la integral converge.** $\frac{1}{x} \to 0$ y su integral diverge.
- **Confundir "no acotada" con "área infinita".** $\frac{1}{\sqrt{x}}$ no está acotada cerca de 0 y su área es 2.

## Conexiones

Las integrales impropias combinan [[limites]] con el [[teorema-fundamental-del-calculo]]. La [[funcion-gamma]], la [[funcion-beta]] y la [[funcion-error]] se definen con ellas. Sus criterios de convergencia son análogos a los de [[series-y-convergencia-de-series]]. En probabilidad, la existencia de la media o la varianza de una distribución depende de que ciertas integrales impropias converjan; la distribución de Cauchy no tiene media por esa razón.

## Formulario

:::formula[Intervalo infinito]
$$
\int_a^{\infty} f(x)\,dx = \lim_{b \to \infty}\int_a^{b} f(x)\,dx
$$

- Converge si el límite es finito.
:::

:::formula[Integrando no acotado]
$$
\int_a^{b} f(x)\,dx = \lim_{\varepsilon \to 0^+}\int_{a+\varepsilon}^{b} f(x)\,dx
$$

- $f$ no acotada cerca de $a$.
:::

:::formula[Criterios de las potencias]
$$
\int_1^{\infty}\frac{dx}{x^{p}} = \frac{1}{p - 1}\ (p > 1), \qquad \int_0^{1}\frac{dx}{x^{p}} = \frac{1}{1 - p}\ (p < 1)
$$

- $p$: exponente; en los demás casos la integral diverge.
:::

:::formula[Integrales notables]
$$
\int_0^{\infty}x^{n}e^{-x}\,dx = n!, \qquad \int_{-\infty}^{\infty}e^{-x^{2}}\,dx = \sqrt{\pi}
$$

- $n$: entero no negativo.
:::
