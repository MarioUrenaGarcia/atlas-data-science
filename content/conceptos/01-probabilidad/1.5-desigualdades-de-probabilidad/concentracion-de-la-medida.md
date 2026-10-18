---
id: concentracion-de-la-medida
titulo: Concentración de la medida
titulo_en: Concentration of measure
alias:
  - fenómeno de concentración de la medida
  - concentración gaussiana
  - funciones de Lipschitz de variables gaussianas
modulo: 1
submodulo: '1.5'
orden: 12
nivel: avanzado
prerrequisitos:
  - desigualdad-de-mcdiarmid
  - matriz-de-covarianza
relaciones:
  - tipo: relacionado
    id: distribucion-normal-multivariada
etiquetas:
  - alta dimensión
  - funciones de Lipschitz
  - cáscara delgada
  - maldición de la dimensión
resumen: >
  En alta dimensión, toda función de muchas variables independientes que no cambia bruscamente es
  casi constante. La norma de un vector gaussiano de dimensión d vale casi exactamente raíz de d,
  con fluctuaciones que no crecen con d.
formula: 'P\big(|f(\mathbf{X}) - \mathbb{E} f(\mathbf{X})| \ge t\big) \le 2e^{-t^2/(2L^2)}, \qquad \mathbf{X} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}_d)'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: medida
    dimension: 100
    umbral: 2
referencias:
  - clave: murphy
  - clave: hastie-esl
publicado: true
---

## Intuición

Un vector con 100 coordenadas normales estándar independientes tiene norma cercana a 10, la raíz de 100, y casi nunca se aleja de ella más de 2. Con 10000 coordenadas, la norma es casi exactamente 100. Cada coordenada es muy aleatoria, pero la norma, que las combina todas sin depender demasiado de ninguna, es casi determinista.

Ese es el **fenómeno de concentración de la medida**: en alta dimensión, una función suave de muchas variables independientes toma casi siempre valores muy cercanos a su media. Tiene consecuencias sorprendentes: casi todos los puntos de una nube gaussiana viven en una cáscara delgada lejos del centro, dos vectores al azar son casi ortogonales, y todas las distancias entre puntos aleatorios son casi iguales. Esto último está detrás de la "maldición de la dimensión": en muchas dimensiones, el vecino más cercano y el más lejano están casi a la misma distancia.

## Definición

:::teorema[Concentración gaussiana]
Sea $\mathbf{X} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}_d)$ y sea $f : \mathbb{R}^d \to \mathbb{R}$ una función de Lipschitz con constante $L$, es decir, $|f(\mathbf{x}) - f(\mathbf{y})| \le L\, \lVert \mathbf{x} - \mathbf{y} \rVert$. Entonces, para todo $t > 0$,
$$
P\big(|f(\mathbf{X}) - \mathbb{E} f(\mathbf{X})| \ge t\big) \le 2e^{-t^2/(2L^2)}.
$$
La cota no depende de la dimensión $d$.
:::

La norma $f(\mathbf{x}) = \lVert \mathbf{x} \rVert$ es de Lipschitz con $L = 1$. Como $\mathbb{E}\lVert \mathbf{X} \rVert^2 = d$, la norma vale aproximadamente $\sqrt{d}$, y por el teorema sus fluctuaciones son de orden 1 en cualquier dimensión: en relación con su tamaño, se encogen como $1/\sqrt{d}$.

:::figura[Dimensión 10: la norma, dividida entre $\sqrt{10}$, ya se agrupa alrededor de 1, pero todavía con una dispersión relativa visible.]{componente="InequalityBound"}
```yaml
modo: medida
dimension: 10
umbral: 2
```
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}$: vector aleatorio con $d$ coordenadas normales estándar independientes.
- $\mathbf{0}$: vector de ceros; $\mathbf{I}_d$: matriz identidad de tamaño $d$.
- $\lVert \mathbf{x} \rVert$: norma euclidiana.
- $f$: función de Lipschitz con constante $L$.
- $t$: desviación respecto a la media.
- $d$: dimensión.
:::

## Cómo usar la visualización

Para la dimensión elegida se simulan 1500 vectores gaussianos. A la izquierda, el histograma de $\lVert \mathbf{X} \rVert / \sqrt{d}$; a la derecha, el de $\lVert \mathbf{X} \rVert - \sqrt{d}$. El panel da la media y la desviación estándar de la norma y compara la fracción que se aleja $t$ o más de la media con la cota $2e^{-t^2/2}$.

El botón de reproducción recorre las dimensiones 1, 2, 5, ..., 500. El histograma de la izquierda se vuelve una aguja alrededor de 1; el de la derecha conserva su ancho, con desviación estándar cercana a 0.7 en todas las dimensiones.

## Ejemplo

Un vector gaussiano de dimensión $d = 500$.

1. Su norma es aproximadamente $\sqrt{500} \approx 22.4$.
2. Por la concentración gaussiana con $L = 1$: $P\big(|\lVert \mathbf{X} \rVert - \mathbb{E}\lVert \mathbf{X} \rVert| \ge 2\big) \le 2e^{-2} \approx 0.27$.
3. La desviación relativa es de alrededor de $0.7 / 22.4 \approx 3\,\%$: casi todos los puntos están en una cáscara entre radios 21 y 24.
4. En cambio, la bola de radio 10 alrededor del origen, que en una dimensión contendría casi toda la probabilidad, aquí prácticamente no contiene puntos.

:::figura[Dimensión 500: la norma relativa es una aguja en 1, mientras que la diferencia con $\sqrt{500}$ tiene el mismo ancho que en dimensión 10.]{componente="InequalityBound"}
```yaml
modo: medida
dimension: 500
umbral: 2
```
:::

## Propiedades

- **Independiente de la dimensión:** la cota gaussiana depende de $L$ y $t$, no de $d$.
- **Funciones de Lipschitz:** la norma, la distancia a un conjunto, el máximo de las coordenadas y muchas funciones de pérdida se concentran.
- **Ortogonalidad:** el producto punto de dos vectores gaussianos independientes, dividido entre $d$, se concentra en 0: en alta dimensión dos direcciones al azar son casi perpendiculares.
- **Relación con McDiarmid:** para variables acotadas, la desigualdad de McDiarmid expresa el mismo fenómeno con diferencias acotadas en lugar de constantes de Lipschitz.

:::figura[Dimensión 2: la norma de un vector gaussiano plano sigue una distribución de Rayleigh, muy dispersa en relación con su media; todavía no hay concentración visible.]{componente="InequalityBound"}
```yaml
modo: medida
dimension: 2
umbral: 1
```
:::

## Errores comunes

- **Imaginar la nube gaussiana como una bola llena.** En alta dimensión casi no hay puntos cerca del centro, aunque la densidad sea máxima ahí: el volumen cercano al centro es diminuto.
- **Creer que las fluctuaciones crecen con la dimensión.** La norma crece como $\sqrt{d}$, pero sus fluctuaciones absolutas no crecen.
- **Aplicarla a funciones que no son de Lipschitz.** El cuadrado de la norma, $\lVert \mathbf{X} \rVert^2$, tiene fluctuaciones que sí crecen, como $\sqrt{2d}$.

:::figura[Dimensión 1: la norma es $|Z|$, con una distribución ancha. La cota $2e^{-1/2} \approx 1.21$ supera 1 y no dice nada para $t = 1$.]{componente="InequalityBound"}
```yaml
modo: medida
dimension: 1
umbral: 1
```
:::

## Conexiones

La concentración de la medida generaliza la [[desigualdad-de-mcdiarmid]] y la [[desigualdad-de-hoeffding]] a funciones de Lipschitz de vectores aleatorios. El vector gaussiano estándar tiene [[matriz-de-covarianza]] identidad, y la [[distribucion-normal-multivariada]] es el escenario típico. La aparente paradoja de los puntos lejos del centro conecta con la [[desigualdad-de-chebyshev]] aplicada a $\lVert \mathbf{X} \rVert^2$, cuya varianza es $2d$.

## Formulario

:::formula[Concentración gaussiana]
$$
P\big(|f(\mathbf{X}) - \mathbb{E} f(\mathbf{X})| \ge t\big) \le 2e^{-t^2/(2L^2)}
$$

- $\mathbf{X} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}_d)$: vector de $d$ coordenadas normales estándar independientes; $\mathbf{0}$: vector de ceros; $\mathbf{I}_d$: matriz identidad de tamaño $d$.
- $f : \mathbb{R}^d \to \mathbb{R}$: función de Lipschitz con constante $L$; $\mathbb{E} f(\mathbf{X})$: su media.
- $t > 0$: desviación respecto a la media. La cota no depende de $d$.
:::

:::formula[Condición de Lipschitz]
$$
|f(\mathbf{x}) - f(\mathbf{y})| \le L\, \lVert \mathbf{x} - \mathbf{y} \rVert
$$

- $\mathbf{x}$, $\mathbf{y}$: dos puntos cualesquiera de $\mathbb{R}^d$; $\lVert \cdot \rVert$: norma euclidiana.
- $L$: constante de Lipschitz, el mayor cambio de $f$ por unidad de distancia.
:::

:::formula[Norma de un vector gaussiano]
$$
\mathbb{E}\lVert \mathbf{X} \rVert^2 = d, \qquad \lVert \mathbf{X} \rVert \approx \sqrt{d} \pm O(1)
$$

- $d$: dimensión; $O(1)$: una cantidad acotada que no crece con $d$.
- Las fluctuaciones absolutas de la norma son de orden 1; las relativas, de orden $1/\sqrt{d}$.
:::

:::formula[Varianza del cuadrado de la norma]
$$
\operatorname{Var}\big(\lVert \mathbf{X} \rVert^2\big) = 2d
$$

- $\lVert \mathbf{X} \rVert^2 = X_1^2 + \dots + X_d^2$ es una ji cuadrada con $d$ grados de libertad; $\operatorname{Var}$: varianza.
- Sus fluctuaciones crecen como $\sqrt{2d}$, porque $\lVert \mathbf{x} \rVert^2$ no es de Lipschitz.
:::
