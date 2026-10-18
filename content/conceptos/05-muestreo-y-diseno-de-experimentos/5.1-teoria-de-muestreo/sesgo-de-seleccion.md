---
id: sesgo-de-seleccion
titulo: Sesgo de selección
titulo_en: Selection bias
alias:
  - sesgo de muestreo
  - muestra no representativa
modulo: 5
submodulo: '5.1'
orden: 18
nivel: basico
prerrequisitos:
  - muestreo-por-conveniencia
relaciones:
  - tipo: relacionado
    id: marco-muestral
  - tipo: relacionado
    id: paradoja-de-simpson
etiquetas:
  - sesgo
  - representatividad
  - probabilidad de selección
  - validez externa
resumen: >
  Error sistemático que aparece cuando la probabilidad de que una unidad entre en la muestra depende
  de la variable que se quiere medir. Ningún tamaño de muestra lo corrige.
formula: '\operatorname{Sesgo} = \frac{\operatorname{Cov}(s, y)}{\bar{s}}, \qquad \bar{s} = \frac{1}{N}\sum_{i=1}^{N} s_i'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: seleccion
    disenos: [seleccion, mas]
    n: 40
    sesgo: 1
    repeticiones: 400
    poblacion:
      columnas: 24
      filas: 14
      estratos:
        - nombre: Ciudad
          media: 14000
      desviacion: 5500
      icc: 0.1
      minimo: 3000
      decimales: 0
      variable: Ingreso mensual del hogar
      unidad: pesos
      nombreUnidad: Hogar
referencias:
  - clave: lohr
    capitulo: '1'
  - clave: hernan-robins
publicado: true
---

## Intuición

Una aplicación de banca pide a sus usuarios que contesten una encuesta sobre ingresos del hogar y los resultados se publican como "el ingreso de los hogares de la ciudad". Pero tener la aplicación, tener un teléfono con datos y tiempo para contestar está más extendido entre los hogares con más ingresos. No es que se haya elegido mal a nadie en particular: es que la probabilidad de terminar en la muestra sube con la propia variable que se quería medir.

Eso es el **sesgo de selección**. La muestra puede ser enorme, contestada con honestidad y analizada sin errores, y aun así describir a otra población: la de quienes tenían más probabilidad de ser seleccionados. Aparece cuando un marco omite a ciertos grupos, cuando los participantes se ofrecen como voluntarios, cuando solo se observa a quienes llegan a un hospital o cuando el estudio se queda con quienes terminan un programa. El remedio no es pedir más datos del mismo modo, sino cambiar el mecanismo de selección o conocerlo lo suficiente para corregirlo.

## Definición

:::definicion[Sesgo de selección]
Sea $s_i \ge 0$ la probabilidad (o propensión relativa) de que la unidad $i$ entre en la muestra. Si $s_i$ no es constante y está relacionada con $y_i$, la media muestral estima
$$
\bar{Y}_s = \frac{\sum_{i=1}^{N} s_i\,y_i}{\sum_{i=1}^{N} s_i}
$$
en lugar de $\bar{Y}$. La diferencia es el **sesgo de selección**:
$$
\bar{Y}_s - \bar{Y} = \frac{\operatorname{Cov}(s, y)}{\bar{s}},
$$
donde la covarianza y la media se calculan sobre las $N$ unidades de la población.
:::

Hay sesgo si y solo si la selección y la variable están correlacionadas en la población. Si la selección depende de una variable auxiliar $x$ conocida para toda la población y $y$ solo se relaciona con $s$ a través de $x$, ponderar por $1/s_i$ o post-estratificar por $x$ elimina el sesgo; si la selección depende directamente de $y$, no existe corrección sin supuestos adicionales.

:::nota[Qué significa cada símbolo]
- $s_i$: propensión de la unidad $i$ a ser seleccionada.
- $\bar{s}$: propensión promedio en la población.
- $y_i$: valor de la variable en la unidad $i$; $\bar{Y}$: media real.
- $\bar{Y}_s$: media que estima, en promedio, una muestra seleccionada con propensiones $s_i$.
- $\operatorname{Cov}(s, y)$: covarianza poblacional entre propensión y variable.
- $x$: variable auxiliar que explica la selección.
:::

## Cómo usar la visualización

Cada punto es un hogar y su tono indica el ingreso mensual. Con el diseño de selección sesgada, la probabilidad de entrar crece como $e^{\beta z}$, donde $z$ es el ingreso estandarizado; el control $\beta$ fija la intensidad. Al reproducir se seleccionan 40 hogares y el histograma acumula 400 repeticiones.

Experimentos sugeridos:

- Observa que los hogares seleccionados son los de tonos más oscuros y que el histograma queda a la derecha de la media real.
- Pon $\beta = 0$: la selección deja de depender del ingreso y el sesgo desaparece.
- Pon $\beta$ negativo, como en una encuesta en un comedor comunitario: el sesgo cambia de signo.

## Ejemplo

Una ciudad tiene 60 % de hogares de ingreso bajo (8000 pesos en promedio) y 40 % de ingreso alto (22000 pesos). La media real es $0.6 \cdot 8000 + 0.4 \cdot 22000 = 13600$ pesos. La encuesta por aplicación alcanza al 5 % de los hogares de ingreso bajo y al 20 % de los de ingreso alto.

1. Propensión media: $\bar{s} = 0.6 \cdot 0.05 + 0.4 \cdot 0.20 = 0.11$.
2. Media que estima la encuesta: $\frac{0.6 \cdot 0.05 \cdot 8000 + 0.4 \cdot 0.20 \cdot 22000}{0.11} = \frac{240 + 1760}{0.11} = 18182$ pesos.
3. Sesgo: $18182 - 13600 = 4582$ pesos, una sobrestimación de un tercio.
4. Entre los que contestan, $0.08/0.11 = 73\,\%$ son de ingreso alto, aunque en la ciudad son 40 %.
5. Si se supiera qué hogares son de ingreso alto (por ejemplo, por la colonia), post-estratificar por esa variable eliminaría este sesgo.

:::figura[Una sola muestra con selección sesgada: los hogares elegidos se concentran entre los de mayor ingreso.]{componente="SurveySampler"}
```yaml
diseno: seleccion
n: 40
sesgo: 1
repeticiones: 1
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Ciudad
      media: 14000
  desviacion: 5500
  icc: 0.1
  minimo: 3000
  decimales: 0
  variable: Ingreso mensual del hogar
  unidad: pesos
  nombreUnidad: Hogar
```
:::

## Propiedades

- **Sin correlación no hay sesgo**: si la selección es independiente de $y$, la muestra, aunque no sea aleatoria, estima bien la media.
- **El sesgo no se corrige aumentando $n$**: mientras la muestra sea una fracción pequeña de la población, más unidades solo reducen la varianza alrededor de $\bar{Y}_s$, no la distancia a $\bar{Y}$. El sesgo baja únicamente cuando la muestra se acerca a abarcar a toda la población.
- **El signo depende de la dirección de la selección**: si se seleccionan más las unidades con valores bajos, el sesgo es negativo.
- **También distorsiona relaciones entre variables**: seleccionar según un efecto común de dos variables puede crear una asociación entre ellas que no existe en la población.

:::figura[Propiedad sin correlación: con β = 0 la selección no depende del ingreso y el histograma se centra en la media real.]{componente="SurveySampler"}
```yaml
diseno: seleccion
n: 40
sesgo: 0
repeticiones: 400
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Ciudad
      media: 14000
  desviacion: 5500
  icc: 0.1
  minimo: 3000
  decimales: 0
  variable: Ingreso mensual del hogar
  unidad: pesos
  nombreUnidad: Hogar
```
:::

:::figura[Propiedad del signo: en una encuesta de salud aplicada en salas de espera, las personas con peor estado de salud tienen más probabilidad de estar ahí, y la proporción de buena salud queda subestimada.]{componente="SurveySampler"}
```yaml
diseno: seleccion
disenos: [seleccion, mas]
n: 40
sesgo: -1.2
repeticiones: 400
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Municipio
      media: 0.7
  desviacion: 1
  icc: 0.05
  binaria: true
  variable: Reporta buena salud
  nombreUnidad: Persona
```
:::

## Errores comunes

- **Pensar que muchos datos compensan una mala selección.** Un millón de respuestas de usuarios de una aplicación siguen describiendo a los usuarios de la aplicación.
- **Creer que sortear dentro del grupo seleccionado resuelve el problema.** Elegir al azar entre quienes respondieron no cambia el hecho de que la probabilidad de responder dependía de $y$.
- **Generalizar a otra población.** Un estudio con pacientes hospitalizados describe a los hospitalizados, no a todos los enfermos.

:::figura[Error de compensar con muchos datos: en una ciudad de 1200 hogares, una muestra de 200 seleccionada del mismo modo da un histograma angosto que sigue igual de lejos de la media real.]{componente="SurveySampler"}
```yaml
diseno: seleccion
n: 200
nMaximo: 300
sesgo: 1
repeticiones: 300
poblacion:
  columnas: 40
  filas: 30
  estratos:
    - nombre: Ciudad
      media: 14000
  desviacion: 5500
  icc: 0.1
  minimo: 3000
  decimales: 0
  variable: Ingreso mensual del hogar
  unidad: pesos
  nombreUnidad: Hogar
```
:::

## Conexiones

El sesgo de selección es el problema común detrás de un [[marco-muestral]] incompleto, del [[muestreo-por-conveniencia]] y del muestreo por cuotas; la no respuesta y la supervivencia son dos de sus formas más frecuentes. Su fórmula es una [[covarianza-muestral|covarianza]] entre selección y variable. Cuando la selección depende de dos variables a la vez, puede producir asociaciones espurias y reversiones como la [[paradoja-de-simpson]].

## Formulario

:::formula[Media que estima una muestra seleccionada]
$$
\bar{Y}_s = \frac{\sum_{i=1}^{N} s_i\,y_i}{\sum_{i=1}^{N} s_i}
$$

- $s_i$: propensión a ser seleccionada de la unidad $i$.
- $y_i$: valor de la unidad $i$; $N$: tamaño de la población.
:::

:::formula[Sesgo de selección]
$$
\bar{Y}_s - \bar{Y} = \frac{\operatorname{Cov}(s, y)}{\bar{s}}
$$

- $\operatorname{Cov}(s, y)$: covarianza poblacional entre selección y variable.
- $\bar{s}$: propensión media.
:::

:::formula[Modelo de selección de la visualización]
$$
s_i \propto e^{\beta z_i}, \qquad z_i = \frac{y_i - \bar{Y}}{S}
$$

- $\beta$: intensidad de la selección; $\beta = 0$ es selección al azar.
- $z_i$: valor estandarizado de la unidad $i$; $S$: desviación estándar poblacional.
:::
