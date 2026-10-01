---
id: metodo-de-newton
titulo: Método de Newton
titulo_en: Newton's method
alias:
  - método de Newton-Raphson en optimización
  - Newton para optimización
modulo: 0
submodulo: '0.6'
orden: 8
nivel: intermedio
prerrequisitos:
  - descenso-de-gradiente
  - matriz-hessiana
etiquetas:
  - método de Newton
  - hessiana
  - convergencia cuadrática
  - optimización
resumen: >
  El método de Newton salta en cada paso al mínimo de la aproximación cuadrática local, restando H⁻¹∇f al punto; cerca
  de un mínimo con hessiana definida positiva converge cuadráticamente.
formula: '\mathbf{x}_{k+1} = \mathbf{x}_k - \mathbf{H}_f(\mathbf{x}_k)^{-1}\,\nabla f(\mathbf{x}_k)'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: carrera
    funciones: [rosenbrock, himmelblau, cuadratica]
    metodos: [gradiente, newton]
    inicio: [-1.2, 1]
    tasa: 0.001
referencias:
  - clave: boyd
    capitulo: '9.5'
  - clave: goodfellow
    capitulo: '8.6'
publicado: true
---

## Intuición

El descenso de gradiente solo usa la pendiente: sabe hacia dónde baja el terreno, pero no a qué distancia está el fondo. El método de Newton usa también la curvatura. Con la pendiente y la curvatura se construye una parábola, o en varias variables un paraboloide, que imita a la función cerca del punto; su mínimo se calcula exactamente, y Newton salta directo ahí.

Si la función es cuadrática, la imitación es perfecta y Newton llega en un solo paso, sin importar qué tan alargado sea el valle. Cerca de un mínimo cualquier función suave se parece mucho a una cuadrática, y por eso Newton converge de forma espectacular: el número de cifras correctas aproximadamente se duplica en cada paso. El precio es calcular y resolver con la hessiana, caro con muchas variables, y un comportamiento poco confiable lejos del mínimo, donde la parábola puede apuntar a un máximo o a una silla.

## Definición

:::definicion[Paso de Newton]
En el punto $\mathbf{x}_k$, la aproximación cuadrática
$$
q(\mathbf{h}) = f(\mathbf{x}_k) + \nabla f(\mathbf{x}_k)^\top \mathbf{h} + \tfrac{1}{2}\mathbf{h}^\top \mathbf{H}_f(\mathbf{x}_k)\,\mathbf{h}
$$
tiene gradiente cero cuando $\mathbf{H}_f(\mathbf{x}_k)\,\mathbf{h} = -\nabla f(\mathbf{x}_k)$. El método de Newton toma ese paso:
$$
\mathbf{x}_{k+1} = \mathbf{x}_k - \mathbf{H}_f(\mathbf{x}_k)^{-1}\,\nabla f(\mathbf{x}_k).
$$
:::

En la práctica no se invierte la hessiana: se resuelve el sistema lineal $\mathbf{H}\mathbf{h} = -\nabla f$. El **Newton amortiguado** usa $\mathbf{x}_{k+1} = \mathbf{x}_k + \alpha_k\mathbf{h}_k$ con un paso $\alpha_k \le 1$ elegido por búsqueda lineal.

:::teorema[Convergencia cuadrática]
Si $\mathbf{H}_f$ es continua y definida positiva en un mínimo $\mathbf{x}^*$ y el punto inicial está suficientemente cerca, entonces $\lVert \mathbf{x}_{k+1} - \mathbf{x}^* \rVert \le C\,\lVert \mathbf{x}_k - \mathbf{x}^* \rVert^2$ para una constante $C$.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{x}_k$: punto en la iteración $k$.
- $\nabla f(\mathbf{x}_k)$: gradiente; $\mathbf{H}_f(\mathbf{x}_k)$: hessiana.
- $q(\mathbf{h})$: aproximación cuadrática de $f$ alrededor de $\mathbf{x}_k$.
- $\mathbf{h}$: paso de Newton, solución de $\mathbf{H}\mathbf{h} = -\nabla f$.
- $\alpha_k$: paso de amortiguamiento.
- $\mathbf{x}^*$: mínimo; $C$: constante de la convergencia cuadrática.
:::

## Cómo usar la visualización

Se comparan el descenso de gradiente y el método de Newton desde el mismo punto. El encabezado da, para cada método, el punto actual y el valor de la función; el panel compara los valores en cada iteración. El selector cambia la función y los controles mueven el punto inicial.

En Rosenbrock, el gradiente avanza despacio por el valle mientras Newton llega al mínimo $(1, 1)$ en siete pasos, aunque en el camino da un salto grande. En la cuadrática alargada, Newton llega en un paso. En Himmelblau, según el inicio, Newton puede terminar en una silla o en el máximo.

## Ejemplo

Para $f(x, y) = \tfrac{1}{2}(3x^2 + 4xy + 3y^2) - x + y$ se da un paso de Newton desde $(-2, 1)$.

1. Gradiente: $\nabla f = (3x + 2y - 1,\ 2x + 3y + 1)$; en el inicio, $\nabla f(-2, 1) = (-5, 0)$.
2. Hessiana constante: $\mathbf{H} = \begin{pmatrix} 3 & 2 \\ 2 & 3 \end{pmatrix}$, con inversa $\mathbf{H}^{-1} = \tfrac{1}{5}\begin{pmatrix} 3 & -2 \\ -2 & 3 \end{pmatrix}$.
3. $\mathbf{H}^{-1}\nabla f = \tfrac{1}{5}(3 \cdot (-5) - 2 \cdot 0,\ -2 \cdot (-5) + 3 \cdot 0) = (-3, 2)$.
4. $\mathbf{x}_1 = (-2, 1) - (-3, 2) = (1, -1)$, donde $\nabla f = (3 - 2 - 1,\ 2 - 3 + 1) = (0, 0)$.
5. Un solo paso basta porque $f$ es cuadrática; el descenso de gradiente con paso fijo necesita decenas de pasos para la misma precisión.

:::figura[El paso de Newton del ejemplo: desde (-2, 1) va directo al mínimo (1, -1) de la cuadrática; el encabezado escribe el gradiente (-5, 0) y el punto nuevo.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [girada]
metodos: [newton]
inicio: [-2, 1]
```
:::

## Propiedades

- **Invariancia afín:** si se cambian las variables con $\mathbf{x} = \mathbf{A}\mathbf{z}$, los pasos de Newton se transforman igual; el método no depende de la escala ni de la rotación del problema, a diferencia del gradiente.
- **Convergencia local cuadrática:** cerca del mínimo, el error del paso siguiente es del orden del cuadrado del error actual.
- **Costo:** cada paso requiere la hessiana y resolver un sistema de $n \times n$, del orden de $n^3$ operaciones.
- **Puntos críticos de cualquier tipo:** Newton busca puntos con gradiente cero; si la hessiana no es definida positiva, el paso puede no ser de descenso.
- **Relación con Newton-Raphson:** es el método de Newton para resolver el sistema $\nabla f(\mathbf{x}) = \mathbf{0}$.

:::figura[Newton puro sobre Rosenbrock desde (-1.2, 1): la función sube a 1410 en el segundo paso, porque lejos del mínimo la parábola local engaña, pero después converge cuadráticamente: 0.056, 0.31, 1.9 · 10⁻¹¹ y 3.4 · 10⁻²⁰.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [rosenbrock]
metodos: [newton]
inicio: [-1.2, 1]
```
:::

## Errores comunes

- **Suponer que Newton siempre baja.** Si la hessiana no es definida positiva, el paso puede subir o dirigirse a un máximo.
- **Invertir la hessiana explícitamente.** Es más caro e inestable que resolver el sistema lineal.
- **Usar el paso completo lejos del mínimo.** Sin amortiguamiento, el método puede divergir; la búsqueda lineal lo corrige.
- **Creer que converge desde cualquier punto.** La convergencia cuadrática es local; desde lejos puede comportarse peor que el gradiente.

:::figura[En Himmelblau, empezando en (-0.3, -0.9), cerca del máximo, Newton converge en tres pasos al máximo local (-0.27, -0.92), con f = 181.6: busca un punto con gradiente cero, no un mínimo.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [himmelblau]
metodos: [newton]
inicio: [-0.3, -0.9]
```
:::

## Conexiones

Mejora al [[descenso-de-gradiente]] usando la [[matriz-hessiana]] y la aproximación cuadrática de la [[serie-de-taylor-y-de-maclaurin|serie de Taylor]]. Cada paso resuelve un [[sistemas-de-ecuaciones-lineales|sistema lineal]], a menudo con [[descomposicion-de-cholesky]]. Los [[metodos-cuasi-newton]] evitan calcular la hessiana y la [[busqueda-lineal]] lo vuelve confiable lejos del mínimo. En estadística, el algoritmo de puntaje de Fisher para modelos lineales generalizados es una variante de Newton.

## Formulario

:::formula[Paso de Newton]
$$
\mathbf{x}_{k+1} = \mathbf{x}_k - \mathbf{H}_f(\mathbf{x}_k)^{-1}\,\nabla f(\mathbf{x}_k)
$$

- $\mathbf{H}_f$: hessiana; $\nabla f$: gradiente.
:::

:::formula[Sistema de Newton]
$$
\mathbf{H}_f(\mathbf{x}_k)\,\mathbf{h}_k = -\nabla f(\mathbf{x}_k)
$$

- $\mathbf{h}_k$: paso, que se obtiene resolviendo el sistema.
:::

:::formula[Newton amortiguado]
$$
\mathbf{x}_{k+1} = \mathbf{x}_k + \alpha_k\,\mathbf{h}_k, \qquad 0 < \alpha_k \le 1
$$

- $\alpha_k$: paso elegido por búsqueda lineal.
:::

:::formula[Convergencia cuadrática]
$$
\lVert \mathbf{x}_{k+1} - \mathbf{x}^* \rVert \le C\,\lVert \mathbf{x}_k - \mathbf{x}^* \rVert^2
$$

- $\mathbf{x}^*$: mínimo con hessiana definida positiva; $C$: constante.
:::
