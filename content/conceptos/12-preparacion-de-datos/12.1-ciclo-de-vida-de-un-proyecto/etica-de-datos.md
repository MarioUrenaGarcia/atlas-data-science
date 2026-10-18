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

Dos medidas concretas: una tabla tiene **k-anonimato** si cada combinación de cuasiidentificadores aparece al menos $k$ veces, y un clasificador cumple **igualdad de oportunidades** si, entre las personas que merecen el resultado favorable (la clase positiva, por ejemplo "pagaría el crédito"), la proporción que lo recibe es la misma en todos los grupos:

$$
k = \min_{j} |C_j|, \qquad \mathrm{TVP}_g = \frac{VP_g}{VP_g + FN_g} = 1 - \mathrm{TFN}_g, \qquad \mathrm{TFP}_g = \frac{FP_g}{FP_g + VN_g}.
$$

Con la clase positiva definida como el resultado favorable, un falso negativo es una persona que merecía el beneficio y no lo recibió: es el error que daña directamente al grupo.

:::nota[Qué significa cada símbolo]
- $C_j$: clase de equivalencia $j$, es decir, el conjunto de registros que comparten los mismos valores de los cuasiidentificadores.
- $|C_j|$: número de registros en esa clase.
- $k$: tamaño de la clase más pequeña; $k = 1$ significa que al menos una persona es única.
- $g$: grupo de personas, por ejemplo A y B.
- $VP_g, FP_g, FN_g, VN_g$: conteos de la matriz de confusión dentro del grupo $g$, con la clase positiva igual al resultado favorable.
- $\mathrm{TVP}_g$: tasa de verdaderos positivos del grupo $g$, la proporción de quienes merecen el beneficio y lo reciben.
- $\mathrm{TFN}_g$: tasa de falsos negativos, la proporción de quienes lo merecen y no lo reciben.
- $\mathrm{TFP}_g$: tasa de falsos positivos, la proporción de quienes no lo merecen y lo reciben.
:::

## Cómo usar la visualización

Cada punto es un paciente de una tabla sin nombres y su color es el diagnóstico. Al reproducir, se cruzan con una lista pública, una por una, las columnas sexo, edad y código postal; cada columna parte los recuadros en grupos más pequeños. Un recuadro rojo contiene a una sola persona: su diagnóstico queda revelado. Las lecturas muestran el número de registros únicos y el valor de $k$.

Los controles generalizan las columnas: conservar menos dígitos del código postal o agrupar las edades en intervalos. Experimento sugerido: con las tres columnas cruzadas, reducir el código postal a 3 dígitos y usar grupos de edad de 10 años, y observar cuántos recuadros rojos desaparecen. También conviene buscar recuadros de varias personas con un solo color: aunque nadie sea único, todos comparten diagnóstico.

## Ejemplo

**Privacidad.** Ocho pacientes tienen (código postal, edad, sexo): (06700, 34, F), (06700, 36, F), (06720, 52, M), (06720, 58, M), (03100, 41, F), (03100, 47, F), (03140, 29, M) y (03140, 25, M).

1. Con los valores exactos, las ocho combinaciones son distintas: $k = 1$ y los 8 registros son únicos.
2. Se generaliza el código postal a 3 dígitos y la edad a décadas: las clases son (067, 30 a 39, F), (067, 50 a 59, M), (031, 40 a 49, F) y (031, 20 a 29, M), con 2 registros cada una. Ahora $k = 2$.

**Equidad.** Un modelo aprueba créditos en dos grupos de 200 solicitantes; la clase positiva es "pagaría" y la acción es aprobar. En A, 140 personas pagarían y 60 no; en B, 170 pagarían y 30 no. El modelo aprueba en A a 126 buenos pagadores y a 16 morosos, y en B a 102 buenos pagadores y a 6 morosos.

1. Buenos pagadores rechazados: $FN_A = 140 - 126 = 14$ y $FN_B = 170 - 102 = 68$, así que $\mathrm{TFN}_A = 14/140 = 0.10$ y $\mathrm{TFN}_B = 68/170 = 0.40$.
2. Tasas de verdaderos positivos: $\mathrm{TVP}_A = 0.90$ y $\mathrm{TVP}_B = 0.60$. Cuatro de cada diez buenos pagadores de B son rechazados, contra uno de cada diez en A: el modelo viola la igualdad de oportunidades, y el daño lo sufren las personas de B.
3. Morosos aprobados: $\mathrm{TFP}_A = 16/60 = 0.27$ y $\mathrm{TFP}_B = 6/30 = 0.20$. Este error afecta sobre todo al prestamista, no al grupo.

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

- **Las tasas de error por grupo no pueden igualarse todas a la vez** cuando los grupos tienen distinta proporción de positivos y el modelo no es perfecto: igualar los buenos pagadores rechazados suele separar los morosos aprobados o la proporción de aprobados.

:::figura[Equidad con un umbral común: el modelo separa peor a buenos y malos pagadores en el grupo B, y la proporción de buenos pagadores rechazados en B difiere de la de A.]{componente="DataProjectViz"}
```yaml
modo: equidad
umbral: 0.7
tasas: [0.7, 0.6]
```
:::

## Errores comunes

- **Creer que quitar el nombre anonimiza.** Los cuasiidentificadores (código postal, fecha de nacimiento, sexo) permiten reidentificar por cruce con otras fuentes.
- **Evaluar la equidad solo con la exactitud global.** Un modelo puede tener la misma exactitud en dos grupos y repartir sus errores de forma muy distinta entre falsos positivos y falsos negativos.
- **Definir la clase positiva sin pensar en quién sufre cada error.** Si el positivo es "no pagaría" y la acción es rechazar, el falso negativo es un moroso aprobado, que perjudica al prestamista; el error que perjudica al solicitante es el buen pagador rechazado.
- **Corregir la desigualdad sin decir qué se iguala.** Usar umbrales distintos por grupo puede igualar una tasa a costa de otra; la elección debe hacerse explícita y justificarse según el daño que causa cada error.

:::figura[Error de corregir sin decir qué se iguala: con un umbral distinto para el grupo B se puede acercar su proporción de buenos pagadores rechazados a la de A, pero cambian sus morosos aprobados y su proporción de aprobados.]{componente="DataProjectViz"}
```yaml
modo: equidad
umbral: 0.7
tasas: [0.7, 0.6]
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
\mathrm{TVP}_g = \frac{VP_g}{VP_g + FN_g} = 1 - \mathrm{TFN}_g, \qquad \mathrm{TFP}_g = \frac{FP_g}{FP_g + VN_g}
$$

- $g$: grupo.
- $VP_g, FP_g, FN_g, VN_g$: conteos de la matriz de confusión del grupo, con la clase positiva igual al resultado favorable.
- $\mathrm{TVP}_g$: proporción de quienes merecen el beneficio y lo reciben.
- $\mathrm{TFN}_g$: proporción de quienes merecen el beneficio y no lo reciben.
- $\mathrm{TFP}_g$: proporción de quienes no lo merecen y lo reciben.
:::

:::formula[Igualdad de oportunidades]
$$
\mathrm{TVP}_A = \mathrm{TVP}_B
$$

- $\mathrm{TVP}_A$, $\mathrm{TVP}_B$: tasas de verdaderos positivos de los grupos A y B para el resultado favorable.
:::
