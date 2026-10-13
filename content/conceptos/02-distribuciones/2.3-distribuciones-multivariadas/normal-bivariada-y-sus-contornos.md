---
id: normal-bivariada-y-sus-contornos
titulo: Normal bivariada y sus contornos
titulo_en: Bivariate normal distribution and its contours
alias:
  - normal bivariada
  - curvas de nivel de la normal
  - contornos elípticos
modulo: 2
submodulo: '2.3'
orden: 2
nivel: intermedio
prerrequisitos:
  - distribucion-normal-multivariada
  - curvas-de-nivel
relaciones:
  - tipo: caso-particular
    id: distribucion-normal-multivariada
  - tipo: relacionado
    id: elipses-de-confianza
etiquetas:
  - normal bivariada
  - curvas de nivel
  - correlación
  - valores propios
  - elipses
resumen: >
  La normal en dos dimensiones tiene curvas de nivel elípticas. Sus ejes apuntan en las direcciones de
  los vectores propios de la covarianza y sus semiejes crecen con la raíz de los valores propios.
formula: 'f(x_1, x_2) = \frac{1}{2\pi\sigma_1\sigma_2\sqrt{1 - \rho^{2}}} \exp\!\left(-\frac{z_1^{2} - 2\rho z_1 z_2 + z_2^{2}}{2(1 - \rho^{2})}\right)'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: normal
    valores:
      mu1: 0
      mu2: 0
      sigma1: 1
      sigma2: 1
      rho: 0.8
    niveles: [0.25, 0.5, 0.75, 0.9]
    casos:
      - nombre: 'Matemáticas y física'
        descripcion: 'Calificaciones estandarizadas con ρ = 0.8: los contornos se alargan sobre la diagonal, con ejes a 45 grados.'
        valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.8}
      - nombre: 'Viento este y norte'
        descripcion: 'ρ = 0 y σ₁ = 2, σ₂ = 1: el viento varía más de este a oeste; los contornos son elipses horizontales.'
        valores: {mu1: 0, mu2: 0, sigma1: 2, sigma2: 1, rho: 0}
      - nombre: 'Precio y demanda'
        descripcion: 'ρ = -0.6: cuando el precio sube la demanda baja; los contornos se inclinan hacia abajo a la derecha.'
        valores: {mu1: 0, mu2: 0, sigma1: 1.2, sigma2: 1, rho: -0.6}
referencias:
  - clave: blitzstein-hwang
  - clave: casella-berger
publicado: true
---

## Intuición

Un mapa topográfico dibuja las montañas con curvas de nivel: cada curva une los puntos que están a la misma altura. Si la montaña es la densidad de una normal bivariada, las curvas de nivel son elipses concéntricas alrededor de la cima, que está en el vector de medias.

La forma de esas elipses cuenta toda la historia de la covarianza. Si las dos variables son independientes y tienen la misma dispersión, las elipses son círculos. Si una varía más que la otra, se estiran a lo largo de su eje. Si están correlacionadas, se inclinan: hacia arriba a la derecha con correlación positiva y hacia abajo con correlación negativa, y se vuelven más angostas cuanto más fuerte es la correlación.

Las direcciones en que se estira cada elipse no son arbitrarias: son los vectores propios de la matriz de covarianza, y el largo de cada semieje es proporcional a la raíz del valor propio correspondiente. Leer los contornos es leer la descomposición espectral de la covarianza.

## Definición

:::definicion[Normal bivariada]
El vector $(X_1, X_2)$ tiene **distribución normal bivariada** con medias $\mu_1, \mu_2$, desviaciones $\sigma_1, \sigma_2 > 0$ y correlación $\rho \in (-1, 1)$ si su densidad es
$$
f(x_1, x_2) = \frac{1}{2\pi\sigma_1\sigma_2\sqrt{1 - \rho^{2}}} \exp\!\left(-\frac{z_1^{2} - 2\rho z_1 z_2 + z_2^{2}}{2(1 - \rho^{2})}\right), \qquad z_i = \frac{x_i - \mu_i}{\sigma_i}.
$$
Es el caso $d = 2$ de la normal multivariada con $\boldsymbol{\Sigma} = \begin{pmatrix} \sigma_1^{2} & \rho\sigma_1\sigma_2 \\ \rho\sigma_1\sigma_2 & \sigma_2^{2} \end{pmatrix}$.
:::

:::definicion[Contornos]
La **curva de nivel** de altura $h$ es el conjunto $\{\mathbf{x} : f(\mathbf{x}) = h\}$. Como la densidad depende de $\mathbf{x}$ solo a través de $Q(\mathbf{x}) = (\mathbf{x} - \boldsymbol{\mu})^{\top}\boldsymbol{\Sigma}^{-1}(\mathbf{x} - \boldsymbol{\mu})$, cada curva de nivel es una elipse $Q(\mathbf{x}) = c$. Si $\boldsymbol{\Sigma} = \lambda_1\mathbf{v}_1\mathbf{v}_1^{\top} + \lambda_2\mathbf{v}_2\mathbf{v}_2^{\top}$, la elipse tiene ejes en las direcciones $\mathbf{v}_1, \mathbf{v}_2$ y semiejes $\sqrt{c\lambda_1}$ y $\sqrt{c\lambda_2}$.
:::

:::nota[Qué es X]
$X$ = el par $(X_1, X_2)$ de dos mediciones de la misma unidad, como las calificaciones de un estudiante en matemáticas y en física.
:::

:::nota[Qué hace cada parámetro]
- **$\mu_1, \mu_2$, medias:** la ubicación de la cima. Si aumenta $\mu_1$, todos los contornos se desplazan a la derecha.
- **$\sigma_1, \sigma_2$, desviaciones:** la escala de cada eje. Si aumenta $\sigma_1$, los contornos se estiran horizontalmente.
- **$\rho$, correlación:** la inclinación y lo angosto. Si aumenta hacia 1, las elipses se angostan sobre la diagonal ascendente; si baja hacia $-1$, sobre la descendente.
:::

:::nota[Qué significa cada símbolo]
- $f(x_1, x_2)$: densidad conjunta; $x_1, x_2$: valores de las componentes.
- $z_1, z_2$: valores estandarizados.
- $\mu_i$, $\sigma_i$, $\rho$: medias, desviaciones y correlación.
- $Q(\mathbf{x})$: forma cuadrática, cuadrado de la distancia de Mahalanobis.
- $h$: altura de la curva de nivel; $c$: valor constante de $Q$ sobre ella.
- $\lambda_1 \ge \lambda_2$: valores propios de $\boldsymbol{\Sigma}$; $\mathbf{v}_1, \mathbf{v}_2$: vectores propios unitarios.
:::

## Cómo usar la visualización

Las elipses son las curvas de nivel que encierran el 25, 50, 75 y 90 % de la probabilidad; los segmentos desde el centro son los ejes principales, con las etiquetas $\lambda_1$ y $\lambda_2$. El panel muestra la covarianza, el determinante y los valores propios. El centro se arrastra con el puntero o el teclado. Los casos cargan calificaciones correlacionadas, viento sin correlación y precio con demanda.

Con $\sigma_1 = \sigma_2$ mueve $\rho$ de 0 a 0.9 y observa que los ejes quedan fijos a 45 grados mientras $\lambda_1$ crece y $\lambda_2$ baja. Con $\rho = 0$ cambia $\sigma_1$: los ejes se alinean con las coordenadas. Simula muestras y comprueba que cada elipse contiene la fracción indicada.

## Ejemplo

Las calificaciones estandarizadas de matemáticas y física de un grupo siguen una normal bivariada con $\mu_1 = \mu_2 = 0$, $\sigma_1 = \sigma_2 = 1$ y $\rho = 0.8$.

1. Covarianza: $\boldsymbol{\Sigma} = \begin{pmatrix} 1 & 0.8 \\ 0.8 & 1 \end{pmatrix}$, con traza 2 y determinante $1 - 0.64 = 0.36$.
2. Valores propios: $\lambda = 1 \pm 0.8$, es decir, $\lambda_1 = 1.8$ y $\lambda_2 = 0.2$, con vectores propios $(1, 1)^{\top}/\sqrt{2}$ y $(1, -1)^{\top}/\sqrt{2}$.
3. La elipse que encierra el 90 % tiene $c = -2\log(1 - 0.9) \approx 4.605$.
4. Semiejes: $\sqrt{4.605 \cdot 1.8} \approx 2.879$ sobre la diagonal y $\sqrt{4.605 \cdot 0.2} \approx 0.960$ en la dirección perpendicular.
5. Sobre esa elipse la densidad vale $e^{-c/2} = 0.1$ veces la altura de la cima: la región del 90 % es donde la densidad supera el 10 % de su máximo.

:::figura[Matemáticas y física: con ρ = 0.8 la elipse del 90 % mide 2.88 de semieje mayor sobre la diagonal y 0.96 de semieje menor.]{componente="MultivariateExplorer"}
```yaml
modo: normal
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.8
niveles: [0.9]
```
:::

## Propiedades

- **Elipses de probabilidad:** la región $Q(\mathbf{x}) \le c$ tiene probabilidad $1 - e^{-c/2}$, porque $Q(\mathbf{X}) \sim \chi^{2}_{2}$.
- **Altura relativa:** sobre el contorno de probabilidad $q$, la densidad vale $(1 - q)$ veces la altura de la cima.
- **Ejes a 45 grados:** si $\sigma_1 = \sigma_2$, los ejes principales están sobre las diagonales para cualquier $\rho \ne 0$, con $\lambda = \sigma^{2}(1 \pm \rho)$.
- **Ejes alineados:** si $\rho = 0$, los ejes coinciden con las coordenadas y los semiejes son proporcionales a $\sigma_1$ y $\sigma_2$.
- **Área:** la elipse $Q \le c$ tiene área $\pi c\sqrt{|\boldsymbol{\Sigma}|} = \pi c\,\sigma_1\sigma_2\sqrt{1 - \rho^{2}}$, que se anula cuando $|\rho| \to 1$.
- **Ángulo del eje mayor:** $\theta = \frac{1}{2}\arctan\frac{2\rho\sigma_1\sigma_2}{\sigma_1^{2} - \sigma_2^{2}}$.

:::figura[Casos con contexto (calificaciones correlacionadas, viento sin correlación, precio y demanda): cada botón carga los parámetros y una frase explica por qué los contornos se ven así.]{componente="MultivariateExplorer"}
```yaml
modo: normal
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.8
casos:
  - nombre: 'Matemáticas y física'
    descripcion: 'ρ = 0.8: elipses angostas sobre la diagonal ascendente.'
    valores: {mu1: 0, mu2: 0, sigma1: 1, sigma2: 1, rho: 0.8}
  - nombre: 'Viento este y norte'
    descripcion: 'ρ = 0 con σ₁ = 2: elipses horizontales, ejes alineados con las coordenadas.'
    valores: {mu1: 0, mu2: 0, sigma1: 2, sigma2: 1, rho: 0}
  - nombre: 'Precio y demanda'
    descripcion: 'ρ = -0.6: elipses inclinadas hacia abajo a la derecha.'
    valores: {mu1: 0, mu2: 0, sigma1: 1.2, sigma2: 1, rho: -0.6}
```
:::

:::figura[Ejes alineados: con ρ = 0 y σ₁ = 2, σ₂ = 1 los valores propios son las varianzas 4 y 1 y los ejes principales coinciden con las coordenadas.]{componente="MultivariateExplorer"}
```yaml
modo: normal
valores:
  mu1: 0
  mu2: 0
  sigma1: 2
  sigma2: 1
  rho: 0
```
:::

## Errores comunes

- **Pensar que el eje mayor sigue la recta de regresión.** El eje mayor tiene pendiente 1 cuando $\sigma_1 = \sigma_2$, pero la recta de regresión de $X_2$ sobre $X_1$ tiene pendiente $\rho$, menor; confundirlas exagera la relación.
- **Leer el contorno del 95 % con el valor 1.96.** Para una región conjunta en dos dimensiones el radio al cuadrado es $c = -2\log 0.05 \approx 5.99$, no $1.96^{2} \approx 3.84$.
- **Creer que la inclinación depende solo de $\rho$.** Con desviaciones distintas el ángulo del eje mayor depende también de $\sigma_1$ y $\sigma_2$.
- **Confundir altura de la densidad con probabilidad.** Las curvas de nivel marcan alturas iguales; la probabilidad está en el volumen bajo la superficie.

:::figura[Eje mayor contra regresión: con ρ = 0.5 y desviaciones iguales el eje mayor tiene pendiente 1, mientras que la media condicional de X₂ sube solo 0.5 por cada unidad de X₁.]{componente="MultivariateExplorer"}
```yaml
modo: condicional
valores:
  mu1: 0
  mu2: 0
  sigma1: 1
  sigma2: 1
  rho: 0.5
  corte: 2
```
:::

## Conexiones

Es el caso de dos dimensiones de la [[distribucion-normal-multivariada]]. Sus contornos son [[curvas-de-nivel]] cuyos ejes salen de los [[valores-y-vectores-propios]] de la covarianza, y las regiones que encierran una probabilidad fija son las [[elipses-de-confianza]]. Cortar la superficie en una recta vertical da las distribuciones condicionales de [[marginales-y-condicionales-de-la-normal-multivariada]]. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Densidad bivariada]
$$
f(x_1, x_2) = \frac{1}{2\pi\sigma_1\sigma_2\sqrt{1 - \rho^{2}}} \exp\!\left(-\frac{z_1^{2} - 2\rho z_1 z_2 + z_2^{2}}{2(1 - \rho^{2})}\right)
$$

- $z_i = (x_i - \mu_i)/\sigma_i$: valores estandarizados.
- $\mu_i$, $\sigma_i$: medias y desviaciones; $\rho$: correlación.
:::

:::formula[Semiejes de un contorno]
$$
Q(\mathbf{x}) = c \quad\Longrightarrow\quad \text{semiejes } \sqrt{c\lambda_1},\ \sqrt{c\lambda_2}
$$

- $Q$: forma cuadrática de la densidad; $c$: su valor en el contorno.
- $\lambda_1, \lambda_2$: valores propios de $\boldsymbol{\Sigma}$.
:::

:::formula[Probabilidad dentro de un contorno]
$$
P(Q(\mathbf{X}) \le c) = 1 - e^{-c/2}, \qquad c = -2\log(1 - q)
$$

- $q$: probabilidad deseada dentro de la elipse.
:::

:::formula[Valores propios con desviaciones iguales]
$$
\lambda = \sigma^{2}(1 \pm \rho)
$$

- $\sigma$: desviación común; $\rho$: correlación.
:::

:::formula[Área de la elipse]
$$
A = \pi c\sqrt{|\boldsymbol{\Sigma}|} = \pi c\,\sigma_1\sigma_2\sqrt{1 - \rho^{2}}
$$

- $|\boldsymbol{\Sigma}|$: determinante de la covarianza.
:::

:::formula[Ángulo del eje mayor]
$$
\theta = \tfrac{1}{2}\arctan\frac{2\rho\sigma_1\sigma_2}{\sigma_1^{2} - \sigma_2^{2}}
$$

- $\theta$: ángulo respecto al eje horizontal; con $\sigma_1 = \sigma_2$ vale 45 grados si $\rho > 0$.
:::
