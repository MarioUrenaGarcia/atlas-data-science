---
id: regla-de-la-cadena
titulo: Regla de la cadena
titulo_en: Chain rule
alias:
  - derivada de una composición
  - regla de la cadena de una variable
modulo: 0
submodulo: '0.4'
orden: 6
nivel: basico
prerrequisitos:
  - reglas-de-derivacion
  - funcion-inversa-y-composicion
etiquetas:
  - regla de la cadena
  - composición
  - retropropagación
  - derivadas
resumen: >
  La derivada de una composición f(g(x)) es la derivada de la función exterior evaluada en g(x) por la
  derivada de la interior: los factores de cambio se multiplican a lo largo de la cadena.
formula: '\frac{d}{dx} f(g(x)) = f''(g(x))\,g''(x), \qquad \frac{dy}{dx} = \frac{dy}{du}\,\frac{du}{dx}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: cadena
    exterior: exponencial
    interior: seno
    x0: 0.8
referencias:
  - clave: blitzstein-hwang
  - clave: goodfellow
    capitulo: '6'
publicado: true
---

## Intuición

Si un engrane da 3 vueltas por cada vuelta de otro, y ese otro da 2 vueltas por cada vuelta de la manivela, entonces cada vuelta de la manivela produce $3 \times 2 = 6$ vueltas del primer engrane. Los factores de cambio se multiplican.

Una composición $f(g(x))$ funciona igual. Un pequeño cambio en $x$ produce un cambio en $u = g(x)$ que es $g'(x)$ veces mayor; ese cambio en $u$ produce a su vez un cambio en $f(u)$ que es $f'(u)$ veces mayor. El efecto total es el producto. La única sutileza es que la derivada de la función exterior se evalúa en el punto donde realmente se encuentra, $u = g(x)$, no en $x$. Esta regla, aplicada a cadenas largas de funciones, es exactamente lo que calcula la retropropagación al entrenar una red neuronal.

## Definición

:::teorema[Regla de la cadena]
Si $g$ es derivable en $x$ y $f$ es derivable en $g(x)$, entonces $f \circ g$ es derivable en $x$ y
$$
(f \circ g)'(x) = f'(g(x))\,g'(x).
$$
Con $u = g(x)$ y $y = f(u)$, en notación de Leibniz: $\dfrac{dy}{dx} = \dfrac{dy}{du}\,\dfrac{du}{dx}$.
:::

Para una cadena de tres funciones, $(f \circ g \circ h)'(x) = f'(g(h(x)))\,g'(h(x))\,h'(x)$.

:::nota[Qué significa cada símbolo]
- $g$: función interior, se aplica primero.
- $f$: función exterior, se aplica al resultado de $g$.
- $f \circ g$: composición, $x \mapsto f(g(x))$.
- $u = g(x)$: variable intermedia.
- $f'(g(x))$: derivada de $f$ evaluada en $u = g(x)$.
- $g'(x)$: derivada de la interior en $x$.
- $\frac{dy}{du}, \frac{du}{dx}$: factores de cambio de cada eslabón.
:::

## Cómo usar la visualización

Los tres paneles muestran la función interior $u = g(x)$, la exterior $f(u)$ y la composición $f(g(x))$, cada una con su recta tangente en el punto actual. El control fija $x$ y la reproducción lo desplaza. La fórmula y el panel multiplican las dos pendientes y comparan el resultado con la pendiente de la composición.

En los puntos donde la función interior tiene tangente horizontal, la composición también la tiene, aunque la exterior sea muy inclinada. La pendiente de la composición cambia de signo cuando cambia de signo alguno de los dos factores.

## Ejemplo

La intensidad de una señal es $y = \operatorname{sen}(x^2)$, con $x$ en segundos. Se busca su ritmo de cambio en $x = 1$.

1. Interior: $u = g(x) = x^2$, con $g'(x) = 2x$. Exterior: $f(u) = \operatorname{sen} u$, con $f'(u) = \cos u$.
2. $\frac{dy}{dx} = \cos(x^2)\cdot 2x$.
3. En $x = 1$: $u = 1$, $f'(1) = \cos 1 \approx 0.5403$ y $g'(1) = 2$.
4. $\frac{dy}{dx}\big|_{x=1} = 0.5403 \cdot 2 = 1.0806$.
5. En $x = 2$: $\cos 4 \cdot 4 \approx -0.6536 \cdot 4 = -2.614$; la señal ya está bajando.

:::figura[La señal del ejemplo en sus tres eslabones: la pendiente de u = x² en x = 1 es 2, la de sen u en u = 1 es 0.54, y la de la composición es su producto, 1.08.]{componente="CalculusViz"}
```yaml
modo: cadena
exterior: seno
interior: cuadrada
x0: 1
```
:::

:::figura[La derivada completa de sen(x²): sus oscilaciones se aceleran porque el factor 2x crece, y se anula cada vez que cos(x²) = 0 o x = 0.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [seno-cuadrado]
```
:::

## Propiedades

- **Casos frecuentes:** $\big(e^{g}\big)' = e^{g}g'$, $\big(\log g\big)' = \frac{g'}{g}$, $\big(g^n\big)' = n g^{n-1} g'$.
- **Función inversa:** si $f^{-1}$ es derivable, $(f^{-1})'(y) = \frac{1}{f'(f^{-1}(y))}$.
- **Cambio lineal de variable:** $\frac{d}{dx} f(ax + b) = a\,f'(ax + b)$.
- **Cadenas largas:** en $f_n \circ \dots \circ f_1$ la derivada es el producto de las derivadas de cada eslabón evaluadas en su propia entrada.
- **Retropropagación:** calcular ese producto de derecha a izquierda, reutilizando resultados, es la base del entrenamiento de redes neuronales.

:::demostracion
Idea: $\frac{f(g(x + h)) - f(g(x))}{h} = \frac{f(g(x + h)) - f(g(x))}{g(x + h) - g(x)}\cdot\frac{g(x + h) - g(x)}{h}$ cuando $g(x + h) \neq g(x)$. El segundo factor tiende a $g'(x)$; el primero, como $g(x + h) \to g(x)$, tiende a $f'(g(x))$. El caso en que $g(x + h) = g(x)$ para $h$ arbitrariamente pequeños se trata con una función auxiliar.
:::

## Errores comunes

- **Evaluar la derivada exterior en $x$.** En $\operatorname{sen}(x^2)$ la derivada es $\cos(x^2)\cdot 2x$, no $\cos(x)\cdot 2x$.
- **Olvidar la derivada interior.** $\big(e^{3x}\big)' = 3e^{3x}$, no $e^{3x}$.
- **Confundir composición con producto.** $\operatorname{sen}(x^2)$ no es $\operatorname{sen} x \cdot x^2$.
- **Detenerse antes del último eslabón.** En $\log(\operatorname{sen}(x^2))$ hay tres factores: $\frac{1}{\operatorname{sen}(x^2)}\cdot\cos(x^2)\cdot 2x$.

## Conexiones

La regla de la cadena combina las [[reglas-de-derivacion]] con la [[funcion-inversa-y-composicion|composición de funciones]]. Justifica la [[integracion-por-sustitucion]], que es la regla de la cadena leída al revés, y se generaliza a varias variables con matrices jacobianas. En aprendizaje profundo, la retropropagación aplica esta regla capa por capa para obtener la derivada del error respecto a cada parámetro.

## Formulario

:::formula[Regla de la cadena]
$$
(f \circ g)'(x) = f'(g(x))\,g'(x)
$$

- $g$: función interior; $f$: exterior.
:::

:::formula[Notación de Leibniz]
$$
\frac{dy}{dx} = \frac{dy}{du}\,\frac{du}{dx}
$$

- $u = g(x)$; $y = f(u)$.
:::

:::formula[Casos frecuentes]
$$
\big(e^{g}\big)' = e^{g}\,g', \qquad (\log g)' = \frac{g'}{g}, \qquad (g^n)' = n\,g^{n-1}g'
$$

- $g$: función derivable (positiva para el logaritmo).
:::

:::formula[Derivada de la inversa]
$$
(f^{-1})'(y) = \frac{1}{f'\big(f^{-1}(y)\big)}
$$

- Requiere $f'\big(f^{-1}(y)\big) \neq 0$.
:::
