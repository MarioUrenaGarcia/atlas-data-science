---
id: metodos-proximales-y-gradiente-proximal
titulo: Métodos proximales y gradiente proximal
titulo_en: Proximal methods and proximal gradient
alias:
  - operador proximal
  - ISTA
  - umbral suave
  - soft thresholding
modulo: 0
submodulo: '0.6'
orden: 17
nivel: avanzado
prerrequisitos:
  - descenso-de-gradiente
  - optimizacion-convexa
etiquetas:
  - gradiente proximal
  - operador proximal
  - lasso
  - funciones no diferenciables
resumen: >
  El gradiente proximal minimiza una suma de una parte suave y una no suave: da un paso de gradiente en la
  suave y aplica el operador proximal de la otra; para la norma ℓ1 es el umbral suave.
formula: '\mathbf{x}_{k+1} = \operatorname{prox}_{t h}\big(\mathbf{x}_k - t\,\nabla g(\mathbf{x}_k)\big), \qquad \operatorname{prox}_{t h}(\mathbf{z}) = \arg\min_{\mathbf{x}} \Big(h(\mathbf{x}) + \tfrac{1}{2t}\lVert \mathbf{x} - \mathbf{z} \rVert^2\Big)'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: proximal
    matriz: [[2, 0.5], [0.5, 1]]
    centro: [2, 0.3]
    lambda: 0.8
    inicio: [-0.5, 1.5]
referencias:
  - clave: boyd
  - clave: hastie-esl
    capitulo: '3.4'
publicado: true
---

## Intuición

La regresión lasso agrega a la pérdida la suma de los valores absolutos de los coeficientes. Esa penalización tiene una virtud, deja exactamente en cero los coeficientes poco útiles, y un problema: en cero tiene un pico donde no hay derivada, así que el descenso de gradiente ordinario no sabe qué hacer y oscila alrededor del cero sin quedarse ahí.

El gradiente proximal separa las dos partes. La parte suave, la pérdida, se trata con un paso de gradiente normal. La parte con picos se trata de forma exacta con su operador proximal: el punto que mejor equilibra quedarse cerca de donde dejó el paso de gradiente y tener poca penalización. Para la norma $\ell_1$ ese operador es el umbral suave, que encoge cada coeficiente hacia cero una cantidad fija y, si es más pequeño que esa cantidad, lo deja en cero. Así se obtienen soluciones con ceros exactos con la sencillez del descenso de gradiente.

## Definición

Problema: $\min_{\mathbf{x}} F(\mathbf{x}) = g(\mathbf{x}) + h(\mathbf{x})$, con $g$ convexa y diferenciable de gradiente Lipschitz con constante $L$, y $h$ convexa, posiblemente no diferenciable.

:::definicion[Operador proximal]
$$
\operatorname{prox}_{t h}(\mathbf{z}) = \arg\min_{\mathbf{x}} \Big(h(\mathbf{x}) + \frac{1}{2t}\lVert \mathbf{x} - \mathbf{z} \rVert^2\Big), \qquad t > 0.
$$
Para $h = \lambda\lVert \cdot \rVert_1$ se calcula coordenada por coordenada con el **umbral suave**
$$
S_{t\lambda}(z_i) = \operatorname{sign}(z_i)\max(|z_i| - t\lambda,\ 0).
$$
:::

:::definicion[Gradiente proximal (ISTA)]
$$
\mathbf{x}_{k+1} = \operatorname{prox}_{t h}\big(\mathbf{x}_k - t\,\nabla g(\mathbf{x}_k)\big), \qquad 0 < t \le \frac{1}{L}.
$$
:::

Si $h$ es la indicadora de un conjunto convexo $C$, el operador proximal es la proyección sobre $C$ y el método es el gradiente proyectado. Con $t \le 1/L$, $F(\mathbf{x}_k) - F^*$ decrece como $1/k$; la versión acelerada, FISTA, como $1/k^2$.

:::nota[Qué significa cada símbolo]
- $g$: parte suave del objetivo, por ejemplo una pérdida de mínimos cuadrados.
- $h$: parte no suave, por ejemplo $\lambda\lVert \mathbf{x} \rVert_1$.
- $L$: cota de la curvatura de $g$, el mayor valor propio de su hessiana.
- $t$: tamaño de paso.
- $\operatorname{prox}_{t h}$: operador proximal de $t h$.
- $S_{t\lambda}$: umbral suave con umbral $t\lambda$.
- $\lambda$: peso de la penalización $\ell_1$.
:::

## Cómo usar la visualización

El mapa muestra las curvas de nivel del objetivo de un lasso con dos coeficientes, con sus esquinas sobre los ejes. Cada iteración tiene dos tiempos: primero el paso de gradiente sobre la parte suave, el punto naranja; luego el umbral suave, que lleva al punto amarillo. El encabezado escribe cada tiempo con números. Cuando un coeficiente queda exactamente en cero, el eje correspondiente se resalta. El control cambia $\lambda$.

Con $\lambda = 0.8$ el segundo coeficiente cae a cero en pocas iteraciones y ya no se mueve: el método encuentra la solución dispersa $(1.675, 0)$. Al bajar $\lambda$, los dos coeficientes sobreviven; al subirlo lo suficiente, ambos se anulan.

## Ejemplo

Para $F(\boldsymbol{\beta}) = \tfrac{1}{2}\lVert \boldsymbol{\beta} - \mathbf{b} \rVert^2 + 0.6\,\lVert \boldsymbol{\beta} \rVert_1$ con $\mathbf{b} = (2, 0.4)$, la parte suave tiene $\mathbf{A} = \mathbf{I}$, así que $L = 1$ y $t = 1$.

1. Desde $\boldsymbol{\beta}_0 = (0, 0)$: el paso de gradiente da $\mathbf{z} = \boldsymbol{\beta}_0 - (\boldsymbol{\beta}_0 - \mathbf{b}) = (2, 0.4)$.
2. Umbral suave con $t\lambda = 0.6$: $S(2) = 2 - 0.6 = 1.4$ y $S(0.4) = 0$, porque $|0.4| < 0.6$.
3. $\boldsymbol{\beta}_1 = (1.4, 0)$. El siguiente paso de gradiente vuelve a dar $(2, 0.4)$, así que $(1.4, 0)$ es punto fijo: la solución.
4. Comprobación: $F(1.4, 0) = \tfrac{1}{2}(0.36 + 0.16) + 0.6 \cdot 1.4 = 0.26 + 0.84 = 1.10$, menor que $F(1.4, 0.1) = \tfrac{1}{2}(0.36 + 0.09) + 0.6 \cdot 1.5 = 1.125$.
5. El coeficiente pequeño, 0.4, queda eliminado; el grande se encoge en 0.6.

:::figura[El lasso del ejemplo con A = I: un solo paso de gradiente lleva a (2, 0.4) y el umbral suave de 0.6 deja (1.4, 0), con el segundo coeficiente exactamente en cero.]{componente="OptimizerRace"}
```yaml
modo: proximal
matriz: [[1, 0], [0, 1]]
centro: [2, 0.4]
lambda: 0.6
inicio: [0, 0]
```
:::

## Propiedades

- **Optimalidad:** $\mathbf{x}^*$ es solución si y solo si es punto fijo: $\mathbf{x}^* = \operatorname{prox}_{t h}(\mathbf{x}^* - t\nabla g(\mathbf{x}^*))$.
- **Ceros exactos:** en el lasso, el coeficiente $j$ es cero en la solución si $|\partial g/\partial x_j| \le \lambda$ en ella.
- **Penalización suficiente:** si $\lambda \ge \lVert \nabla g(\mathbf{0}) \rVert_\infty$, la solución es $\mathbf{0}$.
- **Casos particulares:** con $h = 0$ es el descenso de gradiente; con $h$ la indicadora de un conjunto, el gradiente proyectado.
- **Aceleración:** FISTA agrega un término de inercia y mejora la rapidez de $1/k$ a $1/k^2$.

:::figura[Con λ = 4.5, mayor que el máximo de |∇g(0)| = 4.15, la solución es (0, 0): el umbral suave anula ambos coeficientes en el primer paso y el punto ya no se mueve.]{componente="OptimizerRace"}
```yaml
modo: proximal
matriz: [[2, 0.5], [0.5, 1]]
centro: [2, 0.3]
lambda: 4.5
inicio: [2, 1.5]
```
:::

## Errores comunes

- **Usar el gradiente ordinario en la parte no suave.** Con un subgradiente de $|x|$ el método oscila alrededor del cero y no produce ceros exactos.
- **Creer que la penalización $\ell_1$ siempre anula coeficientes.** Con $\lambda$ pequeño todos pueden sobrevivir, solo encogidos.
- **Tomar un paso mayor que $1/L$.** Sin búsqueda lineal, el método puede dejar de descender.
- **Confundir umbral suave con umbral duro.** El duro pone en cero los valores pequeños pero deja intactos los grandes; el suave también encoge los grandes.

:::figura[Con λ = 0.2 la penalización es débil: la solución (1.94, 0.13) conserva los dos coeficientes, encogidos respecto al mínimo sin penalización (2, 0.3), pero ninguno es cero.]{componente="OptimizerRace"}
```yaml
modo: proximal
matriz: [[2, 0.5], [0.5, 1]]
centro: [2, 0.3]
lambda: 0.2
inicio: [-0.5, 1.5]
```
:::

## Conexiones

Generaliza el [[descenso-de-gradiente]] a objetivos con partes no diferenciables dentro de la [[optimizacion-convexa]]. Con la indicadora de un conjunto se reduce a la [[proyeccion-ortogonal]] de la [[optimizacion-con-restricciones]]. Su ejemplo central, el lasso, también se resuelve con [[descenso-por-coordenadas]], y la penalización usa la norma $\ell_1$ de las [[normas-vectoriales]].

## Formulario

:::formula[Paso de gradiente proximal]
$$
\mathbf{x}_{k+1} = \operatorname{prox}_{t h}\big(\mathbf{x}_k - t\,\nabla g(\mathbf{x}_k)\big)
$$

- $g$: parte suave; $h$: parte no suave; $t \le 1/L$: paso.
:::

:::formula[Operador proximal]
$$
\operatorname{prox}_{t h}(\mathbf{z}) = \arg\min_{\mathbf{x}} \Big(h(\mathbf{x}) + \frac{1}{2t}\lVert \mathbf{x} - \mathbf{z} \rVert^2\Big)
$$

- $\mathbf{z}$: punto de partida del operador.
:::

:::formula[Umbral suave]
$$
S_{\tau}(z) = \operatorname{sign}(z)\max(|z| - \tau,\ 0)
$$

- $\tau = t\lambda$: umbral; $z$: una coordenada.
:::

:::formula[Solución cero del lasso]
$$
\lambda \ge \lVert \nabla g(\mathbf{0}) \rVert_\infty \ \Rightarrow\ \mathbf{x}^* = \mathbf{0}
$$

- $\lVert \cdot \rVert_\infty$: mayor valor absoluto de las coordenadas.
:::
