---
id: maldicion-de-la-dimensionalidad
titulo: Maldición de la dimensionalidad
titulo_en: Curse of dimensionality
alias:
  - curse of dimensionality
  - concentración de distancias
  - problemas de alta dimensión
modulo: 12
submodulo: '12.3'
orden: 21
nivel: basico
prerrequisitos:
  - distancias
  - funcion-gamma
etiquetas:
  - alta dimensión
  - distancias
  - selección de características
  - geometría
resumen: >
  Al aumentar el número de variables, los datos se vuelven escasos, casi todo el volumen queda lejos del centro
  y las distancias entre puntos se parecen cada vez más; los métodos basados en vecinos y densidades se degradan.
formula: 'V_d = \frac{\pi^{d/2}}{\Gamma\!\left(\frac{d}{2} + 1\right)}\left(\frac{1}{2}\right)^{d}'
visualizacion:
  componente: FeatureSelectionViz
  parametros:
    modo: dimensionalidad
    dimensiones: 1000
referencias:
  - clave: hastie-esl
  - clave: bishop
publicado: true
---

## Intuición

Con una sola variable, 100 observaciones cubren bien un intervalo: hay un dato cada centésimo de la recta. Con dos variables, las mismas 100 observaciones forman una rejilla de 10 por 10. Con diez variables, para tener la misma densidad haría falta $100^{10}$ observaciones. Al agregar variables, los datos se vuelven escasos muy rápido: cada punto queda aislado en un espacio casi vacío.

La geometría de muchas dimensiones contradice la intuición. En un cuadrado, el círculo inscrito ocupa el 79 % del área; en un cubo de diez dimensiones, la esfera inscrita ocupa menos del 0.3 % del volumen: casi todo está en las esquinas. Y las distancias se concentran: en dimensión alta, el vecino más cercano de un punto está casi tan lejos como el más lejano. Los métodos que dependen de "lo cercano", como los vecinos más próximos o la estimación de densidades, pierden su base. Por eso, antes de agregar todas las variables disponibles, conviene preguntarse cuáles aportan información: es el motivo principal de la selección de características.

## Definición

:::definicion[Maldición de la dimensionalidad]
Se llama **maldición de la dimensionalidad** al conjunto de fenómenos que aparecen cuando el número de variables $d$ crece con un número fijo de observaciones $n$. Entre ellos:

- **Escasez:** para mantener una densidad de $m$ puntos por eje se necesitan $m^d$ observaciones.
- **Volumen en las esquinas:** la fracción del cubo unitario $[0, 1]^d$ que cae dentro de su esfera inscrita, de radio $1/2$, es
$$
V_d = \frac{\pi^{d/2}}{\Gamma\!\left(\frac{d}{2} + 1\right)}\left(\frac{1}{2}\right)^{d},
$$
que tiende a $0$ cuando $d$ crece.
- **Concentración de distancias:** para puntos al azar, el contraste relativo $\dfrac{d_{\max} - d_{\min}}{d_{\min}}$ entre la distancia al vecino más lejano y al más cercano tiende a $0$.
:::

:::nota[Qué significa cada símbolo]
- $d$: número de variables (dimensión del espacio).
- $n$: número de observaciones.
- $m$: puntos por eje deseados.
- $V_d$: fracción del volumen del cubo dentro de la esfera inscrita.
- $\Gamma$: función gamma, que generaliza el factorial: $\Gamma(k + 1) = k!$.
- $d_{\max}$, $d_{\min}$: distancias de un punto a su vecino más lejano y más cercano.
:::

## Cómo usar la visualización

Se generan 300 puntos al azar en un cubo de dimensión creciente y se miden sus distancias a uno de ellos. A la izquierda, el histograma de esas distancias divididas entre la máxima; a la derecha, el contraste relativo según la dimensión, en escala logarítmica. Al reproducir, la dimensión sube de 1 a 1000: el histograma se estrecha alrededor de un valor y el contraste cae. Las lecturas muestran también la fracción del cubo dentro de la esfera inscrita.

Experimento sugerido: detener la animación en dimensión 2 y en dimensión 100 y comparar los histogramas: en la segunda casi todas las distancias superan 0.7 veces la máxima.

## Ejemplo

Fracción del cubo unitario dentro de su esfera inscrita:

1. $d = 2$: $\pi^{1}/\Gamma(2) \cdot (1/2)^2 = \pi/4 = 0.785$.
2. $d = 3$: $\pi^{3/2}/\Gamma(5/2) \cdot (1/8)$. Como $\Gamma(5/2) = \frac{3}{4}\sqrt{\pi}$, queda $\frac{\pi^{3/2}}{0.75\sqrt{\pi}} \cdot \frac{1}{8} = \frac{\pi}{6} = 0.524$.
3. $d = 10$: $\pi^{5}/\Gamma(6) \cdot (1/2)^{10} = 306.02/120/1024 = 0.0025$.
4. Para cubrir el cubo con 10 puntos por eje se necesitan $10^2 = 100$ puntos en dos dimensiones y $10^{10}$ en diez.

:::figura[Hasta dimensión 10: el contraste relativo ya cayó mucho y el histograma de distancias se aleja del cero.]{componente="FeatureSelectionViz"}
```yaml
modo: dimensionalidad
dimensiones: 10
```
:::

## Propiedades

- **La distancia típica crece como $\sqrt{d}$** para puntos uniformes en el cubo, pero su dispersión no crece: relativamente, todas las distancias se parecen.
- **Agregar variables irrelevantes empeora los métodos basados en distancias**, porque cada variable de ruido suma su contribución a todas las distancias por igual.
- **Los modelos con estructura pueden escapar.** Si los datos viven cerca de una superficie de pocas dimensiones o la respuesta depende de pocas variables, el problema efectivo es de baja dimensión.

:::figura[Hasta dimensión 100: la mayoría de las distancias está cerca de la máxima y el vecino más cercano está casi tan lejos como el más lejano.]{componente="FeatureSelectionViz"}
```yaml
modo: dimensionalidad
dimensiones: 100
semilla: 42
```
:::

## Errores comunes

- **Pensar que más variables siempre ayudan.** Con $n$ fijo, cada variable de ruido diluye la información de las útiles y facilita el sobreajuste.
- **Extrapolar la intuición de dos o tres dimensiones.** En dimensión alta casi ningún punto está "en el centro" y casi todos están cerca del borde del espacio.
- **Usar vecinos más cercanos sin reducir dimensión.** Si el contraste de distancias es pequeño, la elección del vecino depende más del ruido que de la semejanza real.

:::figura[Error de extrapolar la intuición: incluso con 20 dimensiones, el histograma de distancias ya no se parece al de dos dimensiones.]{componente="FeatureSelectionViz"}
```yaml
modo: dimensionalidad
dimensiones: 20
```
:::

## Conexiones

La concentración afecta a las [[distancias]] y a todo método que compare vecinos, como la [[imputacion-por-k-vecinos-mas-cercanos]]. El volumen de la esfera usa la [[funcion-gamma]], y la concentración de distancias es una consecuencia de la [[ley-debil-de-los-grandes-numeros]] aplicada a la suma de diferencias al cuadrado. Las respuestas prácticas son elegir variables con la [[seleccion-de-caracteristicas-por-filtro]], la [[seleccion-de-caracteristicas-por-envoltura]] o la [[seleccion-de-caracteristicas-embebida]], y reducir dimensión.

## Formulario

:::formula[Fracción del cubo dentro de la esfera inscrita]
$$
V_d = \frac{\pi^{d/2}}{\Gamma\!\left(\frac{d}{2} + 1\right)}\left(\frac{1}{2}\right)^{d}
$$

- $d$: dimensión.
- $\Gamma$: función gamma.
- $1/2$: radio de la esfera inscrita en el cubo unitario.
:::

:::formula[Contraste relativo de distancias]
$$
C = \frac{d_{\max} - d_{\min}}{d_{\min}}
$$

- $d_{\max}$, $d_{\min}$: distancias al vecino más lejano y al más cercano.
- $C$: contraste; tiende a 0 en dimensión alta.
:::

:::formula[Observaciones para una densidad fija]
$$
n = m^{d}
$$

- $m$: puntos por eje; $d$: dimensión; $n$: observaciones necesarias.
:::
