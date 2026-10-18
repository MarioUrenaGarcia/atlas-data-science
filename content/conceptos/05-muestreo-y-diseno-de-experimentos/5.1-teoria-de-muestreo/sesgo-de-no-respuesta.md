---
id: sesgo-de-no-respuesta
titulo: Sesgo de no respuesta
titulo_en: Nonresponse bias
alias:
  - no respuesta
  - tasa de respuesta
modulo: 5
submodulo: '5.1'
orden: 19
nivel: basico
prerrequisitos:
  - sesgo-de-seleccion
relaciones:
  - tipo: relacionado
    id: ponderacion-y-post-estratificacion
etiquetas:
  - tasa de respuesta
  - encuestas
  - datos faltantes
  - sesgo
resumen: >
  Error sistemático que aparece cuando las unidades seleccionadas que no responden difieren de las que
  sí responden. Depende de la tasa de no respuesta y de esa diferencia, no del tamaño de la muestra.
formula: '\operatorname{Sesgo}(\bar{y}_R) \approx (1 - R)\left(\bar{Y}_R - \bar{Y}_M\right)'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: no-respuesta
    n: 60
    respuesta:
      base: 0
      pendiente: -1.2
    repeticiones: 400
    poblacion:
      columnas: 24
      filas: 14
      estratos:
        - nombre: Empresa
          media: 6
      desviacion: 3
      icc: 0.1
      minimo: 0
      decimales: 1
      variable: Horas extra por semana
      unidad: h
      nombreUnidad: Empleado
referencias:
  - clave: lohr
    capitulo: '8'
publicado: true
---

## Intuición

Recursos humanos sortea 60 empleados para preguntarles cuántas horas extra trabajan a la semana. El sorteo es impecable, pero la encuesta llega por correo y hay que dedicarle diez minutos. Quienes trabajan más horas extra son justamente los que menos tiempo tienen para contestar. La empresa recibe 30 respuestas y calcula su promedio. El resultado sale bajo, porque faltan precisamente los casos más altos.

El **sesgo de no respuesta** aparece cuando no contestar está relacionado con lo que se pregunta. Una tasa de respuesta baja no basta para producirlo: si la mitad que no contesta fuera igual en promedio a la mitad que sí contesta, no habría sesgo. Tampoco basta una tasa alta para evitarlo: si el 10 % que falta es muy distinto del resto, el sesgo puede ser importante. Lo que importa es el producto de cuántos faltan por cuánto difieren, y la diferencia es justo lo que no se observa.

## Definición

:::definicion[Sesgo de no respuesta]
Se divide la población en respondientes, con tamaño $N_R$ y media $\bar{Y}_R$, y no respondientes, con tamaño $N_M$ y media $\bar{Y}_M$. Si se sortea una muestra y solo se usan las respuestas, la media de los respondientes $\bar{y}_R$ estima $\bar{Y}_R$, y su sesgo respecto de $\bar{Y}$ es
$$
\operatorname{Sesgo}(\bar{y}_R) = \bar{Y}_R - \bar{Y} = \frac{N_M}{N}\left(\bar{Y}_R - \bar{Y}_M\right).
$$
:::

En un modelo donde cada unidad responde con probabilidad $\rho_i$ (propensión de respuesta), el sesgo aproximado es
$$
\operatorname{Sesgo}(\bar{y}_R) \approx \frac{\operatorname{Cov}(\rho, y)}{\bar{\rho}},
$$
que es nulo si la propensión de respuesta no está correlacionada con $y$. Los datos faltantes se clasifican según su mecanismo: completamente al azar (no depende de nada), al azar (depende de variables observadas, y se corrige ponderando por ellas) y no al azar (depende de la propia $y$, y no se corrige solo con los datos).

:::nota[Qué significa cada símbolo]
- $N_R$, $N_M$: unidades que responderían y que no responderían; $N = N_R + N_M$.
- $\bar{Y}_R$, $\bar{Y}_M$: medias de respondientes y no respondientes.
- $R = N_R/N$: tasa de respuesta; $1 - R = N_M/N$.
- $\bar{y}_R$: media de los respondientes de la muestra.
- $\rho_i$: propensión de respuesta de la unidad $i$; $\bar{\rho}$: su promedio.
:::

## Cómo usar la visualización

Cada punto es un empleado y su tono indica sus horas extra. Al reproducir se sortean 60 empleados; los que no responden quedan marcados con una cruz. El encabezado promedia solo a quienes respondieron y cuenta cuántos son. El control "Relación entre el valor y la respuesta" fija cómo cambia la propensión a responder con las horas extra.

Experimentos sugeridos:

- Observa que las cruces se concentran en los puntos oscuros, los de más horas extra, y que el histograma queda por debajo de la media real.
- Pon la relación en 0: siguen faltando respuestas, pero el sesgo desaparece.
- Pon la relación en un valor positivo y observa que el sesgo cambia de signo.

## Ejemplo

Una empresa tiene 400 empleados. Si se les preguntara a todos, 240 responderían ($R = 0.6$) con un promedio de 4.5 horas extra, y 160 no responderían, con un promedio de 8 horas.

1. Media real: $\bar{Y} = 0.6 \cdot 4.5 + 0.4 \cdot 8 = 5.9$ horas.
2. Sesgo: $(1 - 0.6)(4.5 - 8) = -1.4$ horas.
3. Una encuesta de 100 empleados sorteados obtendría unas 60 respuestas con media cercana a 4.5 horas.
4. Duplicar la muestra a 200 daría unas 120 respuestas con la misma media esperada: el sesgo sigue siendo $-1.4$.
5. Si se lograra subir la respuesta a 90 % con seguimiento telefónico y los nuevos respondientes tuvieran 8 horas en promedio, el sesgo bajaría a $0.1 \cdot (\bar{Y}_R - \bar{Y}_M)$, mucho menor.

:::figura[Una sola muestra con no respuesta: de los 60 empleados sorteados, los marcados con cruz no contestaron y el promedio se calcula sin ellos.]{componente="SurveySampler"}
```yaml
diseno: no-respuesta
n: 60
respuesta:
  base: 0
  pendiente: -1.2
repeticiones: 1
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Empresa
      media: 6
  desviacion: 3
  icc: 0.1
  minimo: 0
  decimales: 1
  variable: Horas extra por semana
  unidad: h
  nombreUnidad: Empleado
```
:::

## Propiedades

- **El sesgo es el producto de la tasa de no respuesta por la diferencia** entre respondientes y no respondientes.
- **Una tasa de respuesta baja no implica sesgo** si responder no se relaciona con la variable.
- **No disminuye con el tamaño de muestra**: solo baja la varianza alrededor del valor equivocado.
- **Es específico de cada pregunta**: en la misma encuesta, una variable puede tener mucho sesgo y otra ninguno.

:::figura[Propiedad de la tasa baja sin sesgo: en una encuesta de temperatura de refrigeradores en tiendas, solo responde cerca de una de cada cinco, pero responder no depende de la temperatura y no hay sesgo.]{componente="SurveySampler"}
```yaml
diseno: no-respuesta
n: 120
nMaximo: 200
respuesta:
  base: -1.5
  pendiente: 0
repeticiones: 400
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Cadena de tiendas
      media: 4
  desviacion: 1.1
  icc: 0.05
  decimales: 1
  variable: Temperatura del refrigerador
  unidad: °C
  nombreUnidad: Tienda
```
:::

:::figura[Propiedad de la tasa alta con sesgo: más de 80 % de los estudiantes responde una encuesta sobre deudas, pero los pocos que no lo hacen deben mucho más, y la estimación queda baja.]{componente="SurveySampler"}
```yaml
diseno: no-respuesta
n: 80
nMaximo: 200
respuesta:
  base: 2.6
  pendiente: -2
repeticiones: 400
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Universidad
      media: 9000
  desviacion: 6000
  icc: 0
  minimo: 0
  decimales: 0
  variable: Deuda del estudiante
  unidad: pesos
  nombreUnidad: Estudiante
```
:::

## Errores comunes

- **Juzgar la calidad de una encuesta solo por su tasa de respuesta.** Una tasa alta reduce el riesgo, pero no lo elimina; lo decisivo es si responder se relaciona con lo que se mide.
- **Sustituir a los que no responden por otras unidades "parecidas".** La sustitución solo cambia quién completa la muestra; si los que aceptan son distintos de los que rechazan, el sesgo es el mismo.
- **Suponer que la ponderación por sexo y edad lo corrige siempre.** Ponderar corrige la parte de la no respuesta explicada por esas variables; si dentro de cada grupo los que no responden trabajan más horas extra, el sesgo persiste.

:::figura[Error de sustituir sin pensar: con muestras de 150 empleados, el número de respuestas es mayor, pero el histograma sigue igual de lejos de la media real.]{componente="SurveySampler"}
```yaml
diseno: no-respuesta
n: 150
nMaximo: 200
respuesta:
  base: 0
  pendiente: -1.2
repeticiones: 300
poblacion:
  columnas: 24
  filas: 14
  estratos:
    - nombre: Empresa
      media: 6
  desviacion: 3
  icc: 0.1
  minimo: 0
  decimales: 1
  variable: Horas extra por semana
  unidad: h
  nombreUnidad: Empleado
```
:::

## Conexiones

El sesgo de no respuesta es una forma de [[sesgo-de-seleccion]] que ocurre después del sorteo: el diseño es probabilístico, pero la muestra observada no. Se combate con seguimiento a los no respondientes y se corrige parcialmente con [[ponderacion-y-post-estratificacion]] cuando la respuesta depende de variables conocidas. Su análisis comparte el lenguaje de los datos faltantes y la estructura de covarianza del sesgo por un [[marco-muestral]] incompleto.

## Formulario

:::formula[Sesgo determinista de no respuesta]
$$
\operatorname{Sesgo}(\bar{y}_R) = \frac{N_M}{N}\left(\bar{Y}_R - \bar{Y}_M\right) = (1 - R)\left(\bar{Y}_R - \bar{Y}_M\right)
$$

- $N_M/N = 1 - R$: tasa de no respuesta.
- $\bar{Y}_R$, $\bar{Y}_M$: medias de respondientes y no respondientes.
:::

:::formula[Sesgo con propensiones de respuesta]
$$
\operatorname{Sesgo}(\bar{y}_R) \approx \frac{\operatorname{Cov}(\rho, y)}{\bar{\rho}}
$$

- $\rho_i$: probabilidad de que la unidad $i$ responda; $\bar{\rho}$: su promedio.
:::

:::formula[Modelo de respuesta de la visualización]
$$
\rho_i = \frac{1}{1 + e^{-(a + b\,z_i)}}
$$

- $a$: nivel base de respuesta; $b$: relación entre el valor y la respuesta.
- $z_i$: valor estandarizado de la unidad $i$.
:::
