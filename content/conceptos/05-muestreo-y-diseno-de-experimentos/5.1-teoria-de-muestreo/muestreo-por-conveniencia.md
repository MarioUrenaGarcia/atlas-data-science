---
id: muestreo-por-conveniencia
titulo: Muestreo por conveniencia
titulo_en: Convenience sampling
alias:
  - muestreo accidental
  - muestra de voluntarios
  - muestreo no probabilístico
modulo: 5
submodulo: '5.1'
orden: 10
nivel: basico
prerrequisitos:
  - poblacion-y-muestra
relaciones:
  - tipo: contrasta
    id: muestreo-aleatorio-simple
etiquetas:
  - muestreo no probabilístico
  - accesibilidad
  - sesgo
  - estudios piloto
resumen: >
  Se observan las unidades más fáciles de alcanzar: quienes pasan, quienes contestan, quienes están
  cerca. Es rápido y barato, pero sin probabilidades de inclusión conocidas no se puede medir su sesgo
  ni su error.
formula: '\mathbb{E}[\bar{y}_{\mathrm{conv}}] = \frac{\sum_{i=1}^{N} a_i\,y_i}{\sum_{i=1}^{N} a_i}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: conveniencia
    disenos: [conveniencia, mas]
    n: 25
    repeticiones: 300
    poblacion:
      columnas: 24
      filas: 14
      estratos:
        - nombre: Zona metropolitana
          media: 52
      desviacion: 14
      icc: 0.15
      tendencia: 45
      minimo: 5
      decimales: 0
      variable: Tiempo de traslado al trabajo
      unidad: min
      nombreUnidad: Persona
referencias:
  - clave: lohr
    capitulo: '1'
publicado: true
---

## Intuición

Un estudiante quiere saber cuánto tardan los trabajadores de la ciudad en llegar a su empleo y entrevista a las primeras 25 personas que salen de la estación del metro junto a su escuela. En una mañana tiene sus datos. El problema es quiénes son esas 25 personas: viven o trabajan cerca de una estación, en la zona mejor conectada de la ciudad. Los que viajan dos horas desde la periferia casi nunca pasan por esa salida.

El **muestreo por conveniencia** toma lo que está a la mano. No hay un sorteo, así que nadie sabe qué probabilidad tenía cada persona de ser entrevistada. Si la facilidad de acceso no tuviera relación con el tiempo de traslado, la muestra podría salir bien por casualidad; aquí la relación es directa y la estimación queda muy por debajo del valor real. Repetir el estudio otro día en la misma estación produciría el mismo sesgo, porque el error no es mala suerte, sino el método.

## Definición

:::definicion[Muestreo por conveniencia]
Una **muestra por conveniencia** está formada por las unidades más accesibles para quien recolecta los datos: voluntarios, transeúntes, usuarios de un servicio, alumnos del propio salón. No existe un mecanismo aleatorio y las probabilidades de inclusión $\pi_i$ son desconocidas.
:::

Si cada unidad tiene una propensión a ser alcanzada $a_i \ge 0$, la media de una muestra por conveniencia estima, aproximadamente, el promedio de la población ponderado por esas propensiones:
$$
\mathbb{E}[\bar{y}_{\mathrm{conv}}] \approx \frac{\sum_{i=1}^{N} a_i\,y_i}{\sum_{i=1}^{N} a_i}.
$$
Su sesgo respecto de $\bar{Y}$ es, en esencia, la covarianza entre la accesibilidad y la variable dividida entre la accesibilidad media:
$$
\operatorname{Sesgo} \approx \frac{\operatorname{Cov}(a, y)}{\bar{a}}.
$$

:::nota[Qué significa cada símbolo]
- $N$: tamaño de la población; $y_i$: valor de la unidad $i$.
- $a_i$: propensión de la unidad $i$ a ser alcanzada, desconocida en la práctica.
- $\bar{a}$: propensión promedio.
- $\operatorname{Cov}(a, y)$: covarianza poblacional entre accesibilidad y variable.
- $\bar{y}_{\mathrm{conv}}$: media de la muestra por conveniencia; $\bar{Y}$: media real.
:::

## Cómo usar la visualización

Cada punto es una persona que trabaja en la zona metropolitana; el tono indica su tiempo de traslado. El recuadro rojo es la salida del metro. Al reproducir se entrevista a las 25 personas más cercanas a la salida y el histograma acumula 300 repeticiones del estudio.

Experimentos sugeridos:

- Observa que todas las repeticiones caen lejos de la media real: el sesgo es mucho mayor que el error aleatorio.
- Cambia a muestreo aleatorio simple: el histograma se mueve y se centra en la media real.
- Aumenta $n$ a 100 con conveniencia: el sesgo se reduce solo porque la muestra empieza a abarcar una parte mayor de la ciudad.

## Ejemplo

Una población de trabajadores tiene un tiempo medio de traslado de 52 minutos. La mitad cercana a la estación tarda en promedio 36 minutos y la mitad lejana 68.

1. Si la mitad cercana pasa por la estación con propensión $a = 0.9$ y la lejana con $a = 0.1$, la media esperada de la muestra es $\frac{0.9 \cdot 36 + 0.1 \cdot 68}{0.9 + 0.1} = 39.2$ minutos.
2. El sesgo es $39.2 - 52 = -12.8$ minutos.
3. Con fórmula: la covarianza entre $a$ y $y$ es $0.5 \cdot 0.5 \cdot (0.9 - 0.1)(36 - 68) = -6.4$ y $\bar{a} = 0.5$, así que el sesgo es $-6.4/0.5 = -12.8$ minutos.
4. Ninguna de esas cifras se puede calcular con la muestra: las propensiones $a$ son desconocidas.

:::figura[Una sola muestra por conveniencia: las 25 personas entrevistadas se amontonan junto a la salida del metro.]{componente="SurveySampler"}
```yaml
diseno: conveniencia
n: 25
repeticiones: 1
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Zona metropolitana
      media: 52
  desviacion: 14
  icc: 0.15
  tendencia: 45
  minimo: 5
  decimales: 0
  variable: Tiempo de traslado al trabajo
  unidad: min
  nombreUnidad: Persona
```
:::

## Propiedades

- **El sesgo depende de la relación entre accesibilidad y variable**, no del tamaño de muestra.
- **Sin probabilidades de inclusión no hay error estándar válido.** Las fórmulas del muestreo aleatorio simple aplicadas a estos datos miden la variación dentro de la muestra, no la incertidumbre sobre la población.
- **Si la accesibilidad es independiente de la variable**, la muestra no tiene sesgo, pero esa independencia no se puede comprobar con los mismos datos.
- **Es útil para explorar**: probar un cuestionario, encontrar fallas en un instrumento o generar hipótesis.

:::figura[Propiedad sin sesgo: en un lote de tornillos almacenados sin ningún orden, tomar los más cercanos a la puerta del almacén da estimaciones centradas en la media real.]{componente="SurveySampler"}
```yaml
diseno: conveniencia
disenos: [conveniencia, mas]
n: 25
repeticiones: 300
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Almacén
      media: 25
  desviacion: 0.3
  icc: 0
  decimales: 2
  variable: Longitud del tornillo
  unidad: mm
  nombreUnidad: Tornillo
```
:::

## Errores comunes

- **Pensar que una muestra grande compensa la forma de elegirla.** Diez mil respuestas de una encuesta en redes sociales siguen representando a quienes siguen esa cuenta y quisieron contestar.
- **Llamar "aleatoria" a una selección sin sorteo** porque no se eligió a nadie en particular. Aleatorio significa que un mecanismo de azar con probabilidades conocidas decide quién entra.
- **Calcular intervalos de confianza como si fuera un muestreo aleatorio.** El intervalo resultante es angosto y casi nunca contiene el valor real cuando hay sesgo.

:::figura[Error de confiar en una muestra grande: 120 personas elegidas por cercanía a una sucursal bancaria para estimar la proporción de adultos con cuenta de ahorro. La estimación es precisa y está equivocada.]{componente="SurveySampler"}
```yaml
diseno: conveniencia
disenos: [conveniencia, mas]
n: 120
nMaximo: 200
repeticiones: 300
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Municipio
      media: 0.5
  desviacion: 1
  icc: 0.1
  tendencia: -2.5
  binaria: true
  variable: Tiene cuenta de ahorro
  nombreUnidad: Adulto
```
:::

## Conexiones

El muestreo por conveniencia es el contraste natural del [[muestreo-aleatorio-simple]]: comparten la sencillez, pero solo el segundo tiene probabilidades de inclusión conocidas. El [[muestreo-por-cuotas]] es una conveniencia con control de composición. Su sesgo es un caso del sesgo de selección y se relaciona con la [[covarianza-muestral|covarianza]] entre la accesibilidad y la variable de interés. Diferenciar una [[poblacion-y-muestra|muestra]] obtenida así de una probabilística es el primer paso para saber qué conclusiones permite.

## Formulario

:::formula[Valor esperado de la media por conveniencia]
$$
\mathbb{E}[\bar{y}_{\mathrm{conv}}] \approx \frac{\sum_{i=1}^{N} a_i\,y_i}{\sum_{i=1}^{N} a_i}
$$

- $a_i$: propensión de la unidad $i$ a ser alcanzada.
- $y_i$: valor de la unidad $i$; $N$: tamaño de la población.
:::

:::formula[Sesgo por accesibilidad]
$$
\operatorname{Sesgo} \approx \frac{\operatorname{Cov}(a, y)}{\bar{a}}
$$

- $\operatorname{Cov}(a, y)$: covarianza entre propensión y variable en la población.
- $\bar{a}$: propensión media.
:::
