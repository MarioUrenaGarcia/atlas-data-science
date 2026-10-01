---
id: cambio-de-variables-y-determinante-jacobiano
titulo: Cambio de variables y determinante jacobiano
titulo_en: Change of variables and the Jacobian determinant
alias:
  - teorema del cambio de variables
  - sustitución en integrales múltiples
  - factor jacobiano
modulo: 0
submodulo: '0.5'
orden: 12
nivel: intermedio
prerrequisitos:
  - matriz-jacobiana
  - integrales-dobles-y-triples
  - determinante-como-factor-de-volumen
etiquetas:
  - cambio de variables
  - determinante jacobiano
  - integrales múltiples
  - densidades
resumen: >
  Al cambiar de variables en una integral múltiple, el elemento de área se multiplica por el valor absoluto
  del determinante jacobiano, que mide cuánto estira o encoge las áreas la transformación.
formula: '\iint_{T(S)} f(x, y)\,dx\,dy = \iint_S f(T(u, v))\,\lvert \det \mathbf{J}_T(u, v) \rvert\,du\,dv'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: jacobiana
    mapas: [polares, onda, cuadrado]
    punto: [0.6, 0.4]
referencias:
  - clave: strang
  - clave: blitzstein-hwang
    capitulo: '8.1'
  - clave: casella-berger
    capitulo: '4.3'
publicado: true
---

## Intuición

En una variable, la sustitución $x = g(u)$ cambia $dx$ por $g'(u)\,du$: el factor $g'(u)$ corrige el hecho de que un intervalo pequeño en $u$ se estira o se encoge al pasar a $x$. En varias variables pasa lo mismo con áreas y volúmenes. Una transformación lleva cuadritos de las nuevas variables a figuras curvas del plano original, y cada figura tiene un área distinta a la del cuadrito.

El determinante jacobiano es justamente ese factor de área local. En coordenadas polares, un rectangulito de lados $dr$ y $d\theta$ se convierte en un pedazo de anillo de área aproximada $r\,dr\,d\theta$: los pedazos lejos del centro son más grandes, y por eso aparece la $r$. El mismo principio da la fórmula para la densidad de una transformación de variables aleatorias: la densidad nueva es la vieja corregida por cuánto se estiran las áreas.

## Definición

:::teorema[Cambio de variables]
Sea $T : S \to \mathbb{R}^2$, $T(u, v) = (x(u, v), y(u, v))$, una transformación con derivadas parciales continuas, inyectiva en el interior de $S$ y con $\det \mathbf{J}_T \neq 0$ ahí. Si $f$ es continua en $T(S)$,
$$
\iint_{T(S)} f(x, y)\,dx\,dy = \iint_S f(T(u, v))\,\lvert \det \mathbf{J}_T(u, v) \rvert\,du\,dv.
$$
:::

En $n$ variables vale igual con $\mathbf{J}_T$ de $n \times n$: $d\mathbf{x} = \lvert \det \mathbf{J}_T(\mathbf{u}) \rvert\,d\mathbf{u}$.

Para variables aleatorias: si $\mathbf{X}$ tiene densidad $f_{\mathbf{X}}$ y $\mathbf{Y} = g(\mathbf{X})$ con $g$ invertible y diferenciable,
$$
f_{\mathbf{Y}}(\mathbf{y}) = f_{\mathbf{X}}(g^{-1}(\mathbf{y}))\,\lvert \det \mathbf{J}_{g^{-1}}(\mathbf{y}) \rvert.
$$

:::nota[Qué significa cada símbolo]
- $T$: transformación de las nuevas variables $(u, v)$ a las originales $(x, y)$.
- $S$: región en las nuevas variables; $T(S)$: su imagen, la región original.
- $f$: función que se integra.
- $\mathbf{J}_T(u, v)$: matriz jacobiana de $T$.
- $\lvert \det \mathbf{J}_T \rvert$: valor absoluto del determinante jacobiano, el factor de área.
- $\mathbf{X}$, $\mathbf{Y}$: vectores aleatorios; $f_{\mathbf{X}}$, $f_{\mathbf{Y}}$: sus densidades.
- $g$: transformación con $\mathbf{Y} = g(\mathbf{X})$; $g^{-1}$: su inversa.
:::

## Cómo usar la visualización

A la izquierda, la rejilla de las nuevas variables con un cuadrito verde; a la derecha, la rejilla transformada y la imagen del cuadrito. El encabezado escribe la transformación, su jacobiana y el cociente entre el área de la imagen y la del cuadrito. Los controles mueven el cuadrito y la reproducción lo encoge hasta que el cociente coincide con $\lvert \det \mathbf{J} \rvert$.

Con polares, al mover el cuadrito hacia radios mayores el cociente crece en proporción a $r$, y cerca del centro se vuelve casi 0. Con la deformación ondulada el factor de área queda cerca de 1, pero cambia de un lugar a otro.

## Ejemplo

Una pieza metálica ocupa un cuarto de anillo, $1 \le \sqrt{x^2 + y^2} \le 2$ con $x, y \ge 0$ (en decímetros), y su densidad es $x^2 + y^2$ gramos por decímetro cuadrado. Se calcula su masa en polares.

1. Transformación: $T(r, \theta) = (r\cos\theta,\ r\operatorname{sen}\theta)$, con $S = [1, 2] \times [0, \pi/2]$.
2. Jacobiana: $\mathbf{J}_T = \begin{pmatrix} \cos\theta & -r\operatorname{sen}\theta \\ \operatorname{sen}\theta & r\cos\theta \end{pmatrix}$, con $\det \mathbf{J}_T = r\cos^2\theta + r\operatorname{sen}^2\theta = r$.
3. La densidad en polares es $r^2$, así que $M = \int_0^{\pi/2} \int_1^2 r^2 \cdot r\,dr\,d\theta$.
4. Integral interior: $\int_1^2 r^3\,dr = \tfrac{16 - 1}{4} = \tfrac{15}{4}$.
5. Exterior: $M = \tfrac{\pi}{2} \cdot \tfrac{15}{4} = \tfrac{15\pi}{8} = 5.890$ gramos.
6. Sin el factor $r$ se obtendría $\tfrac{\pi}{2} \cdot \tfrac{7}{3} = 3.665$, un error de casi 38 %.

:::figura[Las polares del ejemplo: el cuadrito en r = 1.1 y θ = 0.79 se convierte en un pedazo de anillo, y al encogerse su área se acerca a 1.1 veces la del cuadrito: el factor det J = r.]{componente="SurfaceViz"}
```yaml
modo: jacobiana
mapas: [polares]
punto: [0.5, 0.25]
```
:::

## Propiedades

- **Una variable:** con $x = g(u)$ creciente, la fórmula se reduce a la sustitución $\int f(x)\,dx = \int f(g(u))\,g'(u)\,du$.
- **Transformaciones lineales:** si $T(\mathbf{u}) = \mathbf{A}\mathbf{u}$, el factor es constante: $\lvert \det \mathbf{A} \rvert$.
- **Composición:** el factor de $T_2 \circ T_1$ es el producto de los factores, porque $\det(\mathbf{J}_{T_2}\mathbf{J}_{T_1}) = \det \mathbf{J}_{T_2} \det \mathbf{J}_{T_1}$.
- **Inversa:** $\det \mathbf{J}_{T^{-1}}(T(\mathbf{u})) = 1/\det \mathbf{J}_T(\mathbf{u})$.
- **Coordenadas usuales:** polares, $r$; cilíndricas, $r$; esféricas, $\rho^2\operatorname{sen}\varphi$.

:::figura[El factor de área cambia de un punto a otro: para (u² - v², 2uv), en (0.5, 0.3) vale 4(u² + v²) = 1.36, mientras que en (0.8, 0.6) valía 4.]{componente="SurfaceViz"}
```yaml
modo: jacobiana
mapas: [cuadrado]
punto: [0.25, 0.25]
```
:::

## Errores comunes

- **Olvidar el factor jacobiano.** Cambiar $dx\,dy$ por $dr\,d\theta$ sin la $r$ subestima la integral, como en el paso 6 del ejemplo.
- **Usar el jacobiano de la transformación equivocada.** El factor es el de $T$, la que va de las nuevas variables a las originales; si se tiene la inversa, hay que invertir el determinante.
- **Olvidar el valor absoluto.** Una transformación que invierte la orientación tiene determinante negativo, pero las áreas siguen siendo positivas.
- **Aplicar el teorema sin inyectividad.** Si $T$ cubre una parte de la región dos veces, esa parte se cuenta dos veces.

:::figura[Cerca del centro de las polares, en r = 0.29, el pedazo de anillo es mucho más pequeño que el cuadrito: el factor r = 0.29 encoge las áreas, y omitirlo trataría a esos pedazos como si tuvieran el mismo tamaño que los del borde.]{componente="SurfaceViz"}
```yaml
modo: jacobiana
mapas: [polares]
punto: [0.05, 0.5]
```
:::

## Conexiones

Combina la [[matriz-jacobiana]] con las [[integrales-dobles-y-triples]]; el factor es el de [[determinante-como-factor-de-volumen]] aplicado localmente. Generaliza la [[integracion-por-sustitucion]]. Sus casos más usados son las [[coordenadas-polares-cilindricas-y-esfericas]], con las que se calcula la [[integral-gaussiana]]. En probabilidad da la densidad de transformaciones de vectores aleatorios, como el paso de una normal estándar a una normal con matriz de covarianza cualquiera.

## Formulario

:::formula[Cambio de variables]
$$
\iint_{T(S)} f(x, y)\,dx\,dy = \iint_S f(T(u, v))\,\lvert \det \mathbf{J}_T(u, v) \rvert\,du\,dv
$$

- $T$: transformación de $(u, v)$ a $(x, y)$, inyectiva y suave.
- $S$: región en $(u, v)$; $T(S)$: región en $(x, y)$.
- $\lvert \det \mathbf{J}_T \rvert$: factor de área local.
:::

:::formula[Elemento de área en polares]
$$
dx\,dy = r\,dr\,d\theta
$$

- $r$: distancia al origen; $\theta$: ángulo.
- $r$ es el determinante jacobiano de $(r, \theta) \mapsto (r\cos\theta, r\operatorname{sen}\theta)$.
:::

:::formula[Densidad de una transformación]
$$
f_{\mathbf{Y}}(\mathbf{y}) = f_{\mathbf{X}}(g^{-1}(\mathbf{y}))\,\lvert \det \mathbf{J}_{g^{-1}}(\mathbf{y}) \rvert
$$

- $\mathbf{Y} = g(\mathbf{X})$, con $g$ invertible y diferenciable.
- $\mathbf{J}_{g^{-1}}$: jacobiana de la transformación inversa.
:::

:::formula[Masa del ejemplo]
$$
M = \int_0^{\pi/2} \!\! \int_1^2 r^2 \cdot r\,dr\,d\theta = \frac{15\pi}{8}
$$

- $r^2$: densidad en polares; $r$: factor jacobiano.
:::
