---
id: efecto-de-diseno
titulo: Efecto de diseño
titulo_en: Design effect
alias:
  - deff
  - tamaño efectivo de muestra
  - correlación intraclase
modulo: 5
submodulo: '5.1'
orden: 15
nivel: intermedio
prerrequisitos:
  - muestreo-por-conglomerados
  - factor-de-correccion-por-poblacion-finita
relaciones:
  - tipo: relacionado
    id: muestreo-estratificado
etiquetas:
  - precisión
  - diseño complejo
  - tamaño efectivo
  - correlación intraclase
resumen: >
  Cociente entre la varianza de un estimador bajo un diseño de muestreo y la que tendría con un
  muestreo aleatorio simple del mismo tamaño. Indica cuántas observaciones independientes vale la
  muestra realmente.
formula: '\text{deff} = \frac{\operatorname{Var}_{\text{diseño}}(\hat{\theta})}{\operatorname{Var}_{\mathrm{MAS}}(\hat{\theta})}, \qquad n_{\text{ef}} = \frac{n}{\text{deff}}'
visualizacion:
  componente: PrecisionPlanner
  parametros:
    modo: deff
    m: 8
    rho: 0.1
    n: 800
    nombreConglomerado: Manzana
    nombreUnidad: Hogar
referencias:
  - clave: lohr
    capitulo: '5'
publicado: true
---

## Intuición

Una encuesta de salud visita 100 manzanas y entrevista a 8 hogares en cada una: 800 entrevistas. Pero los hogares de una misma manzana comparten agua, drenaje, centro de salud y nivel de ingresos, así que sus respuestas se parecen. Ocho hogares de la misma manzana no aportan ocho veces la información de uno: aportan bastante menos. ¿Cuántas entrevistas independientes valen esas 800?

El **efecto de diseño** responde esa pregunta. Compara la varianza del estimador con el diseño que realmente se usó contra la varianza que tendría un muestreo aleatorio simple del mismo tamaño. Si vale 1.7, el diseño es 1.7 veces más impreciso, y las 800 entrevistas valen como unas 470 independientes. Si vale menos que 1, como ocurre con una buena estratificación, el diseño es mejor que el aleatorio simple. Es el número que se usa para planear el tamaño de una encuesta compleja y para no reportar márgenes de error engañosamente pequeños.

## Definición

:::definicion[Efecto de diseño y tamaño efectivo]
Para un estimador $\hat{\theta}$ obtenido con un diseño de muestreo de tamaño $n$,
$$
\text{deff} = \frac{\operatorname{Var}_{\text{diseño}}(\hat{\theta})}{\operatorname{Var}_{\mathrm{MAS}}(\hat{\theta})},
$$
donde el denominador es la varianza que tendría el mismo estimador con un muestreo aleatorio simple de $n$ unidades. El **tamaño efectivo de muestra** es $n_{\text{ef}} = n / \text{deff}$.
:::

Para conglomerados de igual tamaño $m$ con correlación intraclase $\rho$,
$$
\text{deff} \approx 1 + (m - 1)\rho.
$$
Para pesos desiguales con valores $w_i$, el efecto de diseño por ponderación de Kish es
$$
\text{deff}_w = \frac{n\sum_i w_i^2}{\left(\sum_i w_i\right)^2} = 1 + \mathrm{CV}^2(w),
$$
donde $\mathrm{CV}(w)$ es el coeficiente de variación de los pesos (con desviación estándar de denominador $n$). Los efectos de conglomeración, estratificación y ponderación se combinan en un efecto total.

:::nota[Qué significa cada símbolo]
- $\hat{\theta}$: estimador, por ejemplo una media o una proporción.
- $\operatorname{Var}_{\text{diseño}}$: varianza con el diseño usado; $\operatorname{Var}_{\mathrm{MAS}}$: con muestreo aleatorio simple del mismo $n$.
- $n$: tamaño real de la muestra; $n_{\text{ef}}$: tamaño efectivo.
- $m$: unidades por conglomerado; $\rho$: correlación intraclase.
- $w_i$: peso de la unidad $i$; $\mathrm{CV}(w)$: coeficiente de variación de los pesos.
:::

## Cómo usar la visualización

Los puntos de arriba son los 800 hogares, agrupados por manzana. Al reproducir, algunos se apagan hasta que solo quedan encendidos tantos como el tamaño efectivo: los apagados representan información repetida por la similitud dentro de las manzanas. Abajo, la gráfica muestra cómo crece el efecto de diseño con el número de hogares por manzana para varias correlaciones intraclase.

Experimentos sugeridos:

- Sube $m$ a 30 con $\rho = 0.1$: el efecto de diseño pasa de 1.7 a 3.9.
- Lleva $\rho$ a 0: no importa cuántos hogares por manzana se tomen, el efecto de diseño es 1.
- Con $\rho = 0.3$, compara $m = 2$ y $m = 20$ y observa cuánto se reduce el tamaño efectivo.

## Ejemplo

La encuesta de salud estima la proporción de hogares con algún integrante con diabetes.

1. Con $m = 8$ hogares por manzana y $\rho = 0.1$: $\text{deff} = 1 + 7 \cdot 0.1 = 1.7$.
2. Tamaño efectivo: $n_{\text{ef}} = 800/1.7 \approx 471$.
3. Si la proporción es $p = 0.2$, el error estándar con muestreo aleatorio simple sería $\sqrt{0.2 \cdot 0.8/800} = 0.0141$.
4. Con el diseño real: $0.0141 \cdot \sqrt{1.7} = 0.0184$, y el margen de error al 95 % pasa de 2.8 a 3.6 puntos porcentuales.
5. Para lograr el margen de 2.8 puntos con el mismo diseño harían falta $800 \cdot 1.7 = 1360$ entrevistas.

:::figura[Efecto de diseño observado en una simulación: 4 manzanas de 24 hogares cada una contra 96 hogares sorteados uno por uno. El histograma de conglomerados es mucho más ancho.]{componente="SurveySampler"}
```yaml
diseno: conglomerados
n: 4
comparar: true
repeticiones: 400
poblacion:
  columnas: 24
  filas: 16
  estratos:
    - nombre: Colonia
      media: 0.2
  conglomerado: [6, 4]
  icc: 0.4
  desviacion: 1
  binaria: true
  variable: Hogar con integrante con diabetes
  nombreUnidad: Hogar
  nombreConglomerado: Manzana
```
:::

## Propiedades

- **deff > 1** en diseños con conglomerados o pesos desiguales; **deff < 1** en diseños estratificados con estratos homogéneos.
- **Depende del estimador**: en una misma encuesta, la proporción de hogares con agua entubada (muy parecida dentro de una manzana) tiene un efecto de diseño mucho mayor que la edad promedio.
- **Crece linealmente con el tamaño del conglomerado**, así que un $\rho$ pequeño puede producir un efecto grande si $m$ es grande.
- **Los pesos desiguales siempre lo aumentan** en la parte de ponderación: $\text{deff}_w \ge 1$, con igualdad solo si todos los pesos son iguales.

:::figura[Propiedad con estratificación: estratificar por región un estudio de rendimiento escolar da un efecto de diseño observado menor que 1.]{componente="SurveySampler"}
```yaml
diseno: estratificado
n: 40
comparar: true
repeticiones: 400
poblacion:
  columnas: 20
  filas: 12
  estratos:
    - nombre: Rural
      media: 58
    - nombre: Semiurbana
      media: 66
    - nombre: Urbana
      media: 74
  desviacion: 6
  icc: 0.1
  decimales: 0
  variable: Puntaje en la prueba de lectura
  unidad: puntos
  nombreUnidad: Escuela
```
:::

:::figura[Propiedad de los pesos desiguales: una muestra con jóvenes subrepresentados recibe pesos distintos por grupo y su efecto de diseño por ponderación es mayor que 1.]{componente="SamplingWeights"}
```yaml
modo: postestratificacion
criterio: Grupo de edad
variable: Viajes semanales en transporte público
grupos:
  - { nombre: 18 a 29, poblacion: 0.3, muestra: 60, media: 9.1 }
  - { nombre: 30 a 59, poblacion: 0.5, muestra: 260, media: 7.4 }
  - { nombre: 60 o más, poblacion: 0.2, muestra: 180, media: 3.2 }
```
:::

## Errores comunes

- **Calcular el margen de error con el tamaño nominal.** En un diseño con conglomerados, $z\sqrt{p(1-p)/n}$ subestima el margen; hay que usar $n_{\text{ef}}$.
- **Usar un único efecto de diseño para todas las variables.** Cada variable tiene su propia correlación intraclase.
- **Creer que más unidades por conglomerado siempre ayudan.** Con $\rho$ alto, pasar de 10 a 40 unidades por conglomerado casi no reduce la varianza y sí encarece la encuesta.

:::figura[Error de usar el tamaño nominal: 1200 alumnos en 40 escuelas con correlación intraclase de 0.2 equivalen a menos de 200 alumnos independientes.]{componente="PrecisionPlanner"}
```yaml
modo: deff
m: 30
rho: 0.2
n: 1200
nombreConglomerado: Escuela
nombreUnidad: Alumno
```
:::

## Conexiones

El efecto de diseño resume la pérdida de precisión del [[muestreo-por-conglomerados]] y la ganancia del [[muestreo-estratificado]] respecto del [[muestreo-aleatorio-simple]]. Se combina con el [[factor-de-correccion-por-poblacion-finita]] al calcular errores estándar y multiplica al tamaño $n_0$ en la planeación del tamaño de muestra. La parte debida a pesos desiguales depende del [[coeficiente-de-variacion]] de los pesos.

## Formulario

:::formula[Efecto de diseño]
$$
\text{deff} = \frac{\operatorname{Var}_{\text{diseño}}(\hat{\theta})}{\operatorname{Var}_{\mathrm{MAS}}(\hat{\theta})}
$$

- $\operatorname{Var}_{\text{diseño}}$: varianza con el diseño real.
- $\operatorname{Var}_{\mathrm{MAS}}$: varianza con muestreo aleatorio simple del mismo tamaño.
:::

:::formula[Tamaño efectivo]
$$
n_{\text{ef}} = \frac{n}{\text{deff}}
$$

- $n$: tamaño real de la muestra.
:::

:::formula[Efecto de diseño de conglomerados]
$$
\text{deff} \approx 1 + (m - 1)\rho
$$

- $m$: unidades por conglomerado; $\rho$: correlación intraclase.
:::

:::formula[Efecto de diseño por ponderación de Kish]
$$
\text{deff}_w = \frac{n\sum_i w_i^2}{\left(\sum_i w_i\right)^2} = 1 + \mathrm{CV}^2(w)
$$

- $w_i$: peso de la unidad $i$.
- $\mathrm{CV}(w)$: coeficiente de variación de los pesos.
:::
