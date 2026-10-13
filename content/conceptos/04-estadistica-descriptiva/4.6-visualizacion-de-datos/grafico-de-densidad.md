---
id: grafico-de-densidad
titulo: Gráfico de densidad
titulo_en: Kernel density plot
alias:
  - estimación de densidad por núcleos
  - densidad suavizada
  - KDE
modulo: 4
submodulo: '4.6'
orden: 6
nivel: basico
prerrequisitos:
  - histograma
etiquetas:
  - visualización
  - densidad
  - suavizado
  - ancho de banda
resumen: >
  Un gráfico de densidad estima la forma de la distribución colocando una pequeña curva, el núcleo,
  sobre cada dato y promediándolas. Es una versión suave del histograma que no depende de bordes.
formula: '\hat{f}_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right)'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: densidad
    muestra:
      nombre: Temperaturas
      forma: mezcla
      parametro: 3.5
      centro: 22
      escala: 3
      n: 150
    eje:
      variable: Temperatura máxima diaria
      unidad: °C
referencias:
  - clave: wasserman
    capitulo: '20'
  - clave: hastie-esl
publicado: true
---

## Intuición

Si cada dato se imagina como un montoncito de arena del mismo volumen colocado en su lugar sobre el eje, el resultado es un paisaje. Donde hay muchos datos juntos, los montones se enciman y forman una loma; donde hay pocos, el terreno queda bajo. Si cada montón tiene una forma suave, como una campana, el paisaje completo es una curva suave que sube y baja según la concentración de datos.

Esa curva es la **estimación de densidad por núcleos**, y su gráfico es el **gráfico de densidad**. A diferencia del histograma, no hay bordes de intervalos que decidir, y la curva no da saltos. La decisión que queda es el ancho de cada montón, llamado **ancho de banda**: montones angostos producen una curva llena de picos que sigue cada dato; montones anchos producen una curva tan suave que borra detalles reales. El tipo de montón, el núcleo, importa mucho menos que su ancho.

## Definición

:::definicion[Estimación de densidad por núcleos]
Dados datos $x_1, \dots, x_n$, un **núcleo** $K$ (una función de densidad simétrica, como la normal estándar) y un **ancho de banda** $h > 0$, la estimación de densidad es

$$
\hat{f}_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right).
$$

:::

Cada término $\frac{1}{h}K\!\left(\frac{x - x_i}{h}\right)$ es una densidad centrada en $x_i$ con escala $h$, y $\hat{f}_h$ es su promedio, así que también integra 1. Una elección común de $h$ es la **regla de Silverman**, $h = 0.9\,\min(s, \mathrm{RIQ}/1.34)\,n^{-1/5}$.

:::figura[Una sola joroba con cola: ingresos de 150 hogares. La densidad suaviza el histograma de fondo y deja ver la cola a la derecha.]{componente="ChartGallery"}
```yaml
grafico: densidad
muestra:
  nombre: Ingresos
  forma: sesgo-derecha
  parametro: 3
  centro: 18
  escala: 7
  n: 150
eje:
  variable: Ingreso mensual
  unidad: miles de pesos
```
:::

:::nota[Qué significa cada símbolo]
- $\hat{f}_h(x)$: densidad estimada en el valor $x$.
- $x_i$: datos; $n$: número de datos.
- $K$: núcleo, una densidad simétrica centrada en cero.
- $h$: ancho de banda, escala de cada núcleo.
- $(x - x_i)/h$: distancia de $x$ al dato $x_i$ medida en anchos de banda.
- $s$: desviación estándar; $\mathrm{RIQ}$: rango intercuartílico.
:::

## Cómo usar la visualización

Las 150 temperaturas máximas se agregan poco a poco; cada dato aporta una pequeña campana azul y la curva gruesa es su promedio. El histograma de fondo sirve de referencia. Los controles cambian el ancho de banda y el tipo de núcleo; el encabezado compara el ancho elegido con el de Silverman.

Con el ancho de Silverman aparecen dos jorobas, la estación fresca y la cálida. Al reducir el ancho a la quinta parte, la curva se llena de picos que corresponden a datos individuales. Al multiplicarlo por cuatro, las dos jorobas se funden en una. Cambiar el núcleo de gaussiano a Epanechnikov apenas modifica la curva.

## Ejemplo

Tres datos, 2, 3 y 5, con núcleo gaussiano y $h = 1$. Se estima la densidad en $x = 3$ y en $x = 4$.

1. El núcleo gaussiano es $K(u) = \frac{1}{\sqrt{2\pi}}e^{-u^2/2}$, con $K(0) \approx 0.399$, $K(1) \approx 0.242$ y $K(2) \approx 0.054$.
2. En $x = 3$: distancias $1, 0, 2$; $\hat{f}(3) = \frac{0.242 + 0.399 + 0.054}{3 \cdot 1} \approx 0.232$.
3. En $x = 4$: distancias $2, 1, 1$; $\hat{f}(4) = \frac{0.054 + 0.242 + 0.242}{3} \approx 0.179$.
4. La densidad es mayor en 3 porque ahí hay un dato y otro a una unidad.

:::figura[Los tres datos del ejemplo con sus tres núcleos y la densidad promedio.]{componente="ChartGallery"}
```yaml
grafico: densidad
muestra:
  nombre: Ejemplo
  valores: [2, 3, 5]
eje:
  variable: Valor
ancho: 1
```
:::

## Propiedades

- **Integra 1 y es no negativa** si el núcleo lo es.
- **El ancho de banda domina:** controla el equilibrio entre sesgo (curva demasiado suave) y varianza (curva ruidosa).
- **El núcleo importa poco:** núcleos distintos con anchos equivalentes dan curvas muy parecidas.
- **Ancho óptimo:** para densidades suaves, el ancho que minimiza el error cuadrático integrado decrece como $n^{-1/5}$.
- **Sesgo en los bordes:** cerca de límites naturales, como cero para tiempos, la estimación asigna densidad a valores imposibles.

:::figura[Propiedad del ancho de banda: las mismas temperaturas con un ancho fijo de 0.4 grados. La curva sigue los datos casi uno por uno y muestra picos que no son estructura real.]{componente="ChartGallery"}
```yaml
grafico: densidad
muestra:
  nombre: Temperaturas
  forma: mezcla
  parametro: 3.5
  centro: 22
  escala: 3
  n: 150
eje:
  variable: Temperatura máxima diaria
  unidad: °C
ancho: 0.4
```
:::

## Errores comunes

- **Confiar en el ancho por defecto.** La regla de Silverman supone una forma cercana a la normal y tiende a suavizar de más distribuciones con varios picos.
- **Leer la altura como probabilidad.** La densidad puede ser mayor que 1; lo que es una probabilidad es el área bajo la curva en un intervalo.
- **Ignorar los límites naturales.** Una densidad de tiempos de espera que se extiende a valores negativos es un artefacto del núcleo.

:::figura[Límite natural: tiempos de espera cortos, muchos cerca de cero. La curva se extiende a la izquierda de cero, donde no puede haber datos.]{componente="ChartGallery"}
```yaml
grafico: densidad
muestra:
  nombre: Esperas
  forma: sesgo-derecha
  parametro: 1
  centro: 3
  escala: 3
  n: 120
eje:
  variable: Tiempo de espera
  unidad: min
```
:::

## Conexiones

El gráfico de densidad es la versión suave del [[histograma]], y la elección del ancho de banda es el análogo de la [[seleccion-del-numero-de-intervalos]]. Se usa dentro del [[diagrama-de-violin]] y del [[grafico-ridgeline]], y permite detectar la [[multimodalidad]]. En probabilidad, estima la función de densidad de una variable aleatoria continua.

## Formulario

:::formula[Densidad por núcleos]
$$
\hat{f}_h(x) = \frac{1}{n h}\sum_{i=1}^{n} K\!\left(\frac{x - x_i}{h}\right)
$$

- $K$: núcleo; $h$: ancho de banda; $x_i$: datos; $n$: número de datos.
:::

:::formula[Núcleo gaussiano]
$$
K(u) = \frac{1}{\sqrt{2\pi}}\,e^{-u^2/2}
$$

- $u$: distancia en anchos de banda.
:::

:::formula[Regla de Silverman]
$$
h = 0.9\,\min\!\left(s,\ \frac{\mathrm{RIQ}}{1.34}\right) n^{-1/5}
$$

- $s$: desviación estándar; $\mathrm{RIQ}$: rango intercuartílico; $n$: número de datos.
:::
