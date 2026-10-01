---
id: reglas-de-derivacion
titulo: Reglas de derivación
titulo_en: Differentiation rules
alias:
  - regla de la potencia
  - regla del producto
  - regla del cociente
  - tabla de derivadas
modulo: 0
submodulo: '0.4'
orden: 5
nivel: basico
prerrequisitos:
  - derivada-como-pendiente-y-razon-de-cambio
etiquetas:
  - derivadas
  - reglas de derivación
  - producto
  - cociente
resumen: >
  Las reglas de derivación permiten calcular derivadas sin límites: la derivada es lineal, x^n se deriva
  como n x^(n-1), y hay fórmulas para productos, cocientes y las funciones elementales.
formula: '(af + bg)'' = af'' + bg'', \quad (x^n)'' = n x^{n-1}, \quad (fg)'' = f''g + fg'', \quad \Big(\frac{f}{g}\Big)'' = \frac{f''g - fg''}{g^2}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: derivadas
    funciones: [cubica, seno, exponencial, logaritmo, raiz]
    orden: 1
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Calcular cada derivada con la definición de límite sería agotador. Afortunadamente, las funciones se construyen con unas pocas piezas (potencias, exponenciales, senos) y unas pocas operaciones (sumar, multiplicar, dividir), y basta conocer la derivada de cada pieza y una regla para cada operación.

La suma es la más simple: si dos cantidades cambian, su suma cambia con la suma de los cambios. El producto es más interesante. Si el área de un rectángulo es base por altura y ambas crecen un poco, el área nueva gana una franja por el crecimiento de la base y otra por el de la altura; por eso la derivada de un producto tiene dos términos, $f'g + fg'$. Con estas reglas, derivar se vuelve un procedimiento mecánico y confiable, que es justamente lo que automatizan los programas de diferenciación automática en aprendizaje profundo.

## Definición

:::teorema[Reglas básicas]
Si $f$ y $g$ son derivables y $a, b, n$ son constantes:
$$
(af + bg)' = af' + bg', \qquad (x^n)' = n\,x^{n-1},
$$
$$
(fg)' = f'g + fg', \qquad \Big(\frac{f}{g}\Big)' = \frac{f'g - fg'}{g^2} \ \ (g \neq 0).
$$
:::

:::definicion[Derivadas de funciones elementales]
$$
(e^x)' = e^x, \quad (\log x)' = \frac{1}{x}, \quad (\operatorname{sen} x)' = \cos x, \quad (\cos x)' = -\operatorname{sen} x, \quad (\sqrt{x})' = \frac{1}{2\sqrt{x}}, \quad (c)' = 0.
$$
:::

La regla de la potencia vale para cualquier exponente real $n$ donde $x^n$ esté definido.

:::nota[Qué significa cada símbolo]
- $f, g$: funciones derivables.
- $f', g'$: sus derivadas.
- $a, b$: constantes que multiplican.
- $n$: exponente, cualquier número real.
- $c$: función constante.
- $\log$: logaritmo natural.
- $\operatorname{sen}, \cos$: seno y coseno, con ángulos en radianes.
:::

## Cómo usar la visualización

El selector elige una función. Arriba, un punto recorre la gráfica con su recta tangente; abajo se dibuja la gráfica de la derivada, cuya altura en cada $x$ es la pendiente de esa tangente. La fórmula muestra $f$, su derivada según las reglas y el valor de $f'$ en el punto actual.

Donde la tangente está horizontal, la gráfica de abajo cruza el cero. Con $e^x$ las dos gráficas son idénticas. Con $\log x$ la derivada $1/x$ es enorme cerca de 0, donde el logaritmo sube casi vertical, y se aplana para $x$ grande.

## Ejemplo

El costo de producir $x$ cientos de piezas es $C(x) = x^3 - 3x$ (en miles de pesos, sobre un costo base). Se busca el costo marginal.

1. Por linealidad y la regla de la potencia: $C'(x) = 3x^2 - 3$.
2. En $x = 2$: $C'(2) = 12 - 3 = 9$ miles de pesos por cada cien piezas adicionales.
3. En $x = 1$: $C'(1) = 0$; el costo está momentáneamente plano.
4. Regla del producto con $f(x) = x e^{-x}$: $f'(x) = 1\cdot e^{-x} + x(-e^{-x}) = (1 - x)e^{-x}$.
5. Regla del cociente con $h(x) = \frac{x}{x^2 + 1}$: $h'(x) = \frac{(x^2 + 1) - x(2x)}{(x^2 + 1)^2} = \frac{1 - x^2}{(x^2 + 1)^2}$.

:::figura[El costo del ejemplo y su costo marginal: la gráfica de abajo, 3x² - 3, se anula exactamente donde la tangente de arriba es horizontal.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [cubica]
```
:::

:::figura[La función del cuarto paso, x e^(-x), derivada con la regla del producto: su derivada (1 - x) e^(-x) es positiva antes de x = 1 y negativa después.]{componente="CalculusViz"}
```yaml
modo: derivadas
funciones: [x-exp]
```
:::

## Propiedades

- **Linealidad:** derivar respeta sumas y múltiplos constantes.
- **Polinomios:** $\big(\sum a_k x^k\big)' = \sum k\,a_k x^{k-1}$.
- **Exponenciales en otra base:** $(b^x)' = b^x \log b$.
- **Recíproco:** $\big(\frac{1}{g}\big)' = -\frac{g'}{g^2}$.
- **Derivada logarítmica:** $\frac{f'}{f} = (\log f)'$, útil para productos de muchos factores.
- **Diferenciación automática:** los programas aplican estas mismas reglas a cada operación elemental de un cálculo para obtener derivadas exactas.

:::demostracion
Regla del producto: $\frac{f(x + h)g(x + h) - f(x)g(x)}{h} = \frac{f(x + h) - f(x)}{h}\,g(x + h) + f(x)\,\frac{g(x + h) - g(x)}{h}$. Al tender $h \to 0$, usando que $g$ es continua, el primer término tiende a $f'(x)g(x)$ y el segundo a $f(x)g'(x)$.
:::

## Errores comunes

- **Derivar un producto como producto de derivadas.** $(x \cdot x)' = 2x$, no $1 \cdot 1 = 1$.
- **Invertir el orden en el cociente.** El numerador es $f'g - fg'$; al revés cambia el signo.
- **Aplicar la regla de la potencia a $e^x$.** $e^x$ no es una potencia de $x$: su derivada es $e^x$, no $x e^{x-1}$.
- **Olvidar que la constante se deriva a cero.** $(x^2 + 5)' = 2x$.

## Conexiones

Estas reglas calculan la [[derivada-como-pendiente-y-razon-de-cambio|derivada]] sin límites. Para composiciones se necesita la [[regla-de-la-cadena]], y aplicarlas repetidamente da las [[derivadas-de-orden-superior]]. La derivada de la [[funcion-exponencial-y-logaritmo-natural|exponencial]] es ella misma, propiedad que la hace central en modelos de crecimiento, y la de la [[funcion-sigmoide-y-funcion-softplus|sigmoide]] se escribe con la propia sigmoide.

## Formulario

:::formula[Linealidad y potencia]
$$
(af + bg)' = af' + bg', \qquad (x^n)' = n\,x^{n-1}
$$

- $a, b$: constantes.
- $n$: exponente real.
:::

:::formula[Producto y cociente]
$$
(fg)' = f'g + fg', \qquad \Big(\frac{f}{g}\Big)' = \frac{f'g - fg'}{g^2}
$$

- $g \neq 0$ en el cociente.
:::

:::formula[Funciones elementales]
$$
(e^x)' = e^x, \quad (\log x)' = \frac{1}{x}, \quad (\operatorname{sen} x)' = \cos x, \quad (\cos x)' = -\operatorname{sen} x
$$

- $\log$: logaritmo natural, para $x > 0$.
:::

:::formula[Base arbitraria]
$$
(b^x)' = b^x \log b
$$

- $b > 0$: base de la exponencial.
:::
