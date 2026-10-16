---
id: etica-de-datos
titulo: Ética de datos
titulo_en: Data ethics
alias:
  - privacidad y equidad
  - k-anonimato
  - equidad algorítmica
  - reidentificación
modulo: 12
submodulo: '12.1'
orden: 7
nivel: basico
prerrequisitos:
  - planteamiento-del-problema
  - pruebas-diagnosticas
etiquetas:
  - privacidad
  - equidad
  - anonimización
  - responsabilidad
resumen: >
  La ética de datos estudia los daños que puede causar un proyecto de datos: reidentificar a personas en
  datos supuestamente anónimos, tratar de forma desigual a grupos y usar datos sin consentimiento.
formula: 'k = \min_{j} |C_j|'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: privacidad
    claves: [sex, age, postal]
referencias:
  - clave: kohavi
  - clave: molnar
publicado: true
---

## Intuición

Un hospital publica una tabla con diagnósticos y, para proteger a los pacientes, borra nombres y números de expediente. Pero conserva el código postal, la edad y el sexo, que parecen inofensivos. Basta cruzar esa tabla con una lista pública, como un padrón o una red social, para que muchas personas queden solas en su combinación de código postal, edad y sexo: su diagnóstico queda expuesto aunque la tabla "no tenga nombres". Quitar los identificadores directos no anonimiza.

El segundo problema es más silencioso. Un modelo de riesgo de crédito puede ser tan exacto como se quiera en promedio y, aun así, equivocarse mucho más con un grupo que tuvo menos ejemplos en los datos de entrenamiento: las personas de ese grupo reciben más rechazos injustificados. La ética de datos no es una lista de buenas intenciones; son cálculos concretos (cuántos registros quedan únicos, cuánto difieren las tasas de error entre grupos) que deben hacerse antes de publicar datos o desplegar un modelo.

## Definición

:::definicion[Ética de datos]
La **ética de datos** es el conjunto de principios y prácticas que evitan daños a las personas representadas en los datos o afectadas por las decisiones que se toman con ellos. Incluye, entre otros:

- **Privacidad:** que nadie pueda ser identificado ni se revele información sensible sin su consentimiento.
- **Equidad:** que los errores y beneficios de un modelo no recaigan de forma desigual e injustificada sobre ciertos grupos.
- **Consentimiento y propósito:** usar los datos solo para fines compatibles con aquellos para los que se recolectaron.
- **Transparencia y rendición de cuentas:** poder explicar y revisar cómo se tomó una decisión.
:::

Dos medidas concretas: una tabla tiene **k-anonimato** si cada combinación de cuasiidentificadores aparece al menos $k$ veces, y un clasificador cumple **igualdad de oportunidades** si su tasa de falsos negativos es la misma en todos los grupos:

$$
k = \min_{j} |C_j|, \qquad \mathrm{TFN}_g = \frac{FN_g}{VP_g + FN_g}, \qquad \mathrm{TFP}_g = \frac{FP_g}{FP_g + VN_g}.
$$

:::nota[Qué significa cada símbolo]
- $C_j$: clase de equivalencia $j$, es decir, el conjunto de registros que comparten los mismos valores de los cuasiidentificadores.
- $|C_j|$: número de registros en esa clase.
- $k$: tamaño de la clase más pequeña; $k = 1$ significa que al menos una persona es única.
- $g$: grupo de personas, por ejemplo A y B.
- $VP_g, FP_g, FN_g, VN_g$: conteos de la matriz de confusión dentro del grupo $g$.
- $\mathrm{TFN}_g$: tasa de falsos negativos del grupo $g$.
- $\mathrm{TFP}_g$: tasa de falsos positivos del grupo $g$.
:::

## Cómo usar la visualización

Cada punto es un paciente de una tabla sin nombres y su color es el diagnóstico. Al reproducir, se cruzan con una lista pública, una por una, las columnas sexo, edad y código postal; cada columna parte los recuadros en grupos más pequeños. Un recuadro rojo contiene a una sola persona: su diagnóstico queda revelado. Las lecturas muestran el número de registros únicos y el valor de $k$.

Los controles generalizan las columnas: conservar menos dígitos del código postal o agrupar las edades en intervalos. Experimento sugerido: con las tres columnas cruzadas, reducir el código postal a 3 dígitos y usar grupos de edad de 10 años, y observar cuántos recuadros rojos desaparecen. También conviene buscar recuadros de varias personas con un solo color: aunque nadie sea único, todos comparten diagnóstico.

## Ejemplo

**Privacidad.** Ocho pacientes tienen (código postal, edad, sexo): (06700, 34, F), (06700, 36, F), (06720, 52, M), (06720, 58, M), (03100, 41, F), (03100, 47, F), (03140, 29, M) y (03140, 25, M).

1. Con los valores exactos, las ocho combinaciones son distintas: $k = 1$ y los 8 registros son únicos.
2. Se generaliza el código postal a 3 dígitos y la edad a décadas: las clases son (067, 30 a 39, F), (067, 50 a 59, M), (031, 40 a 49, F) y (031, 20 a 29, M), con 2 registros cada una. Ahora $k = 2$.

**Equidad.** Un modelo de crédito se aplica a dos grupos de 200 personas. En A hay 60 personas que no pagarían y en B, 30. El modelo rechaza a 70 en A ($VP = 54$, $FP = 16$) y a 40 en B ($VP = 18$, $FP = 22$).

1. $\mathrm{TFP}_A = 16/140 = 0.114$ y $\mathrm{TFP}_B = 22/170 = 0.129$: los rechazos injustificados son parecidos.
2. $\mathrm{TFN}_A = 6/60 = 0.10$ y $\mathrm{TFN}_B = 12/30 = 0.40$: en B el modelo deja pasar a 4 de cada 10 personas que no pagarán, así que es mucho menos útil para ese grupo y viola la igualdad de oportunidades.

:::figura[Generalización: con el código postal reducido a 3 dígitos y grupos de edad de 10 años, la mayoría de los recuadros reúne a varias personas y el k de anonimato sube.]{componente="DataProjectViz"}
```yaml
modo: privacidad
claves: [sex, age, postal]
digitosCp: 3
bandaEdad: 10
```
:::

## Propiedades

- **Cada cuasiidentificador agregado reduce el tamaño de las clases.** Por eso la combinación de pocos datos inocuos basta para identificar a casi cualquier persona.
- **El k-anonimato no protege contra la homogeneidad.** Si todos los registros de una clase tienen el mismo diagnóstico, saber que alguien pertenece a la clase revela el diagnóstico aunque $k$ sea grande.

:::figura[Con solo sexo y grupos de edad de 20 años las clases son grandes; aun así, conviene revisar la lectura de grupos con un solo diagnóstico.]{componente="DataProjectViz"}
```yaml
modo: privacidad
claves: [sex, age]
bandaEdad: 20
registros: 40
```
:::

- **Las tasas de error por grupo no pueden igualarse todas a la vez** cuando los grupos tienen distinta proporción de positivos y el modelo no es perfecto: igualar los falsos negativos suele separar los falsos positivos o la proporción de rechazados.

:::figura[Equidad con un umbral común: el modelo separa peor las clases en el grupo B, cuyas tasas de falsos negativos y de falsos positivos difieren de las del grupo A.]{componente="DataProjectViz"}
```yaml
modo: equidad
umbral: 0.5
tasas: [0.3, 0.15]
```
:::

## Errores comunes

- **Creer que quitar el nombre anonimiza.** Los cuasiidentificadores (código postal, fecha de nacimiento, sexo) permiten reidentificar por cruce con otras fuentes.
- **Evaluar la equidad solo con la exactitud global.** Un modelo puede tener la misma exactitud en dos grupos y repartir sus errores de forma muy distinta entre falsos positivos y falsos negativos.
- **Corregir la desigualdad sin decir qué se iguala.** Usar umbrales distintos por grupo puede igualar una tasa a costa de otra; la elección debe hacerse explícita y justificarse según el daño que causa cada error.

:::figura[Error de corregir sin decir qué se iguala: con un umbral distinto para el grupo B se puede acercar su tasa de falsos negativos a la de A, pero cambian sus falsos positivos y su proporción de rechazados.]{componente="DataProjectViz"}
```yaml
modo: equidad
umbral: 0.5
tasas: [0.3, 0.15]
porGrupo: true
```
:::

## Conexiones

Las tasas de falsos positivos y negativos son las de las [[pruebas-diagnosticas]], calculadas dentro de cada grupo, y su dependencia de la proporción de positivos se relaciona con la [[tasa-base-y-falacia-de-la-tasa-base]]. Las restricciones éticas forman parte del [[planteamiento-del-problema]] y de la fase de comprensión del negocio en la [[metodologia-crisp-dm]]. La elección de qué error pesa más se discute en [[metricas-de-negocio-vs-metricas-del-modelo]], y documentar lo que se hizo con los datos depende de la [[reproducibilidad]].

## Formulario

:::formula[k de anonimato]
$$
k = \min_{j} |C_j|
$$

- $C_j$: clase de equivalencia de registros con los mismos cuasiidentificadores.
- $|C_j|$: tamaño de la clase.
- $k$: tamaño de la clase más pequeña.
:::

:::formula[Tasas de error por grupo]
$$
\mathrm{TFN}_g = \frac{FN_g}{VP_g + FN_g}, \qquad \mathrm{TFP}_g = \frac{FP_g}{FP_g + VN_g}
$$

- $g$: grupo.
- $VP_g, FP_g, FN_g, VN_g$: conteos de la matriz de confusión del grupo.
- $\mathrm{TFN}_g$: proporción de positivos reales que el modelo no detecta.
- $\mathrm{TFP}_g$: proporción de negativos reales que el modelo marca.
:::

:::formula[Igualdad de oportunidades]
$$
\mathrm{TFN}_A = \mathrm{TFN}_B
$$

- $\mathrm{TFN}_A$, $\mathrm{TFN}_B$: tasas de falsos negativos de los grupos A y B.
:::
