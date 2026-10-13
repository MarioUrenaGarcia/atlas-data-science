---
id: descenso-de-gradiente
titulo: Descenso de gradiente
titulo_en: Gradient descent
alias:
  - descenso por gradiente
  - máximo descenso
  - steepest descent
modulo: 0
submodulo: '0.6'
orden: 5
nivel: intermedio
prerrequisitos:
  - gradiente
  - problema-de-optimizacion
etiquetas:
  - descenso de gradiente
  - algoritmo iterativo
  - aprendizaje automático
  - optimización
resumen: >
  El descenso de gradiente mejora un punto paso a paso moviéndose en la dirección opuesta al gradiente,
  con un paso proporcional a la tasa de aprendizaje; es el método básico para entrenar modelos de aprendizaje automático.
formula: '\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: carrera
    funciones: [rosenbrock, cuadratica, himmelblau]
    metodos: [gradiente]
    inicio: [-1.2, 1]
    tasa: 0.001
referencias:
  - clave: goodfellow
    capitulo: '4.3'
  - clave: boyd
    capitulo: '9.3'
publicado: true
---

## Intuición

En una montaña con niebla, la forma más simple de bajar es mirar el suelo, encontrar la dirección de mayor pendiente hacia abajo y dar un paso en ella; luego repetir. No hace falta ver el valle completo: basta la información local de la pendiente. Con pasos cortos se baja siempre, aunque a veces por caminos largos y en zigzag.

El descenso de gradiente es exactamente eso. El gradiente apunta hacia donde la función sube más rápido, así que su opuesto es la dirección de descenso más rápido. En cada paso se resta al punto actual un múltiplo del gradiente, la tasa de aprendizaje. Es el método más usado para entrenar modelos: cada iteración solo pide calcular el gradiente de la pérdida, algo que se puede hacer para millones de parámetros. Su debilidad son los valles alargados, donde la dirección de máximo descenso apunta hacia la pared del valle y no a lo largo de él, y avanza en zigzag.

## Definición

:::definicion[Descenso de gradiente]
Dado un punto inicial $\mathbf{x}_0$ y una tasa de aprendizaje $\eta > 0$, el descenso de gradiente genera
$$
\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k), \qquad k = 0, 1, 2, \dots
$$
y se detiene cuando $\lVert \nabla f(\mathbf{x}_k) \rVert$ es menor que una tolerancia o se alcanza un número máximo de iteraciones.
:::

:::teorema[Convergencia en funciones suaves]
Si $\nabla f$ es Lipschitz con constante $L$, es decir, la curvatura está acotada por $L$, y $0 < \eta \le 1/L$, entonces cada paso reduce la función, $f(\mathbf{x}_{k+1}) \le f(\mathbf{x}_k) - \tfrac{\eta}{2}\lVert \nabla f(\mathbf{x}_k) \rVert^2$, y el gradiente tiende a cero.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{x}_k$: punto en la iteración $k$; $\mathbf{x}_0$: punto inicial.
- $\eta$: tasa de aprendizaje o tamaño de paso.
- $\nabla f(\mathbf{x}_k)$: gradiente en el punto actual.
- $L$: cota de la curvatura, el mayor valor propio posible de la hessiana.
- $\lVert \cdot \rVert$: norma euclidiana.
:::

## Cómo usar la visualización

El mapa muestra las curvas de nivel de la función y el camino del descenso de gradiente desde el punto inicial. El primer renglón del encabezado da el punto actual y el valor de la función; el segundo escribe el paso completo, con el gradiente y el punto siguiente en números. Los controles mueven el punto inicial y cambian la tasa de aprendizaje.

En la función de Rosenbrock el camino baja rápido hasta el fondo del valle curvo y luego avanza muy despacio a lo largo de él. Al aumentar la tasa, el avance se acelera hasta que los pasos empiezan a rebotar entre las paredes del valle y el método se vuelve inestable.

## Ejemplo

La pérdida de un modelo es $f(x, y) = \tfrac{1}{2}(x^2 + 10y^2)$. Se aplica el descenso de gradiente desde $(3, 1.5)$ con $\eta = 0.15$.

1. Gradiente: $\nabla f = (x, 10y)$. En el inicio, $\nabla f(3, 1.5) = (3, 15)$ y $f = \tfrac{1}{2}(9 + 22.5) = 15.75$.
2. Primer paso: $\mathbf{x}_1 = (3, 1.5) - 0.15\,(3, 15) = (2.55, -0.75)$, con $f = \tfrac{1}{2}(6.5025 + 5.625) = 6.0638$.
3. Segundo paso: $\nabla f(\mathbf{x}_1) = (2.55, -7.5)$ y $\mathbf{x}_2 = (2.1675, 0.375)$, con $f = 3.0520$.
4. En general, $x_k = 3 \cdot 0.85^k$ y $y_k = 1.5 \cdot (-0.5)^k$: la coordenada $y$ cambia de signo en cada paso, el zigzag, y la $x$ avanza despacio.
5. Tras 20 pasos, $x_{20} = 3 \cdot 0.85^{20} = 0.1163$ y $|y_{20}| \approx 1.4 \times 10^{-6}$: la dirección de poca curvatura es la que limita la convergencia.

:::figura[El descenso del ejemplo sobre ½(x² + 10y²): el camino zigzaguea en y, donde la curvatura es 10, y avanza despacio en x, donde es 1; el encabezado escribe cada paso con sus números.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [cuadratica]
metodos: [gradiente]
inicio: [3, 1.5]
tasa: 0.15
```
:::

## Propiedades

- **Dirección de descenso:** si $\nabla f(\mathbf{x}) \neq \mathbf{0}$, para $\eta$ pequeña $f(\mathbf{x} - \eta\nabla f(\mathbf{x})) < f(\mathbf{x})$.
- **Funciones cuadráticas:** en $\tfrac{1}{2}\mathbf{x}^\top \mathbf{A}\mathbf{x}$ cada componente en la base de vectores propios se multiplica por $1 - \eta\lambda_i$ en cada paso.
- **Contornos redondos:** si todos los valores propios son iguales, el gradiente apunta al mínimo y con $\eta = 1/\lambda$ se llega en un paso.
- **Condicionamiento:** con el mejor $\eta$ fijo, el error se reduce por un factor $\dfrac{\kappa - 1}{\kappa + 1}$ por paso, donde $\kappa = \lambda_{\max}/\lambda_{\min}$; valles alargados, con $\kappa$ grande, son lentos.
- **Costo por paso:** una evaluación del gradiente; no requiere segundas derivadas.

:::figura[Con contornos redondos, ½(x² + y²) y η = 0.5, el gradiente apunta directo al mínimo y el camino es una recta: cada paso reduce la distancia a la mitad.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [redonda]
metodos: [gradiente]
inicio: [2.5, 2]
tasa: 0.5
```
:::

## Errores comunes

- **Pensar que gradiente cero significa mínimo.** El método se detiene en cualquier punto con gradiente cero, incluidos los puntos silla.
- **Olvidar el signo.** Sumar el gradiente hace subir la función.
- **Usar la misma tasa para cualquier problema.** La tasa adecuada depende de la curvatura; la que funciona en un problema puede divergir en otro.
- **Creer que la dirección opuesta al gradiente apunta al mínimo.** Solo ocurre con contornos circulares; en general apunta hacia la parte más empinada cercana.

:::figura[En la silla x² - y², empezando sobre el eje x en (2, 0), el gradiente nunca tiene componente en y: el descenso converge al punto silla (0, 0), aunque la función no tiene mínimo.]{componente="OptimizerRace"}
```yaml
modo: carrera
funciones: [silla]
metodos: [gradiente]
inicio: [2, 0]
tasa: 0.1
```
:::

## Conexiones

Usa el [[gradiente]] y su propiedad de máximo crecimiento para resolver un [[problema-de-optimizacion]]. Su comportamiento depende de la [[tasa-de-aprendizaje]] y de la [[matriz-hessiana]], cuya razón de valores propios es el [[numero-de-condicion]]. Se mejora con [[busqueda-lineal]], con [[metodo-de-newton]] y [[metodos-cuasi-newton]] y con el [[gradiente-conjugado]]. Con datos grandes se usa su versión de [[optimizacion-estocastica]].

## Formulario

:::formula[Paso de descenso de gradiente]
$$
\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)
$$

- $\mathbf{x}_k$: punto actual; $\eta$: tasa de aprendizaje; $\nabla f$: gradiente.
:::

:::formula[Descenso garantizado]
$$
f(\mathbf{x}_{k+1}) \le f(\mathbf{x}_k) - \frac{\eta}{2}\lVert \nabla f(\mathbf{x}_k) \rVert^2, \qquad 0 < \eta \le \frac{1}{L}
$$

- $L$: cota de la curvatura de $f$.
:::

:::formula[Cuadrática en la base propia]
$$
z_{k+1, i} = (1 - \eta\lambda_i)\,z_{k, i}
$$

- $\lambda_i$: valor propio $i$ de la hessiana; $z_{k, i}$: componente del error en su vector propio.
:::

:::formula[Factor de convergencia con el mejor paso]
$$
\frac{\kappa - 1}{\kappa + 1}, \qquad \kappa = \frac{\lambda_{\max}}{\lambda_{\min}}
$$

- $\kappa$: número de condición de la hessiana.
:::
