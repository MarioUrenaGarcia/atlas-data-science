---
id: valores-atipicos-vs-errores-de-captura
titulo: Valores atípicos vs errores de captura
titulo_en: Outliers vs data entry errors
alias:
  - atípicos legítimos
  - errores de registro
  - valores imposibles
  - outliers
modulo: 12
submodulo: '12.2'
orden: 12
nivel: basico
prerrequisitos:
  - validacion-de-esquema
  - deteccion-de-valores-atipicos-por-rango-intercuartilico
  - deteccion-de-valores-atipicos-por-puntuacion-z-y-z-modificada
etiquetas:
  - valores atípicos
  - calidad de datos
  - exactitud
  - limpieza
resumen: >
  Un valor atípico es raro pero posible; un error de captura es un valor que no corresponde a la realidad.
  Las reglas estadísticas marcan valores alejados, pero solo el conocimiento del dominio separa unos de otros.
formula: '[\,Q_1 - 1.5\,\mathrm{RIC},\ Q_3 + 1.5\,\mathrm{RIC}\,]'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: atipicos
    caso: estatura
    regla: iqr
referencias:
  - clave: tufte
  - clave: wasserman
publicado: true
---

## Intuición

En una campaña de salud se registran estaturas. Aparecen 203 cm, 1.72, 17.2, 0 y 1680. Todos son "raros", pero no del mismo modo. Los 203 cm pertenecen a un jugador de baloncesto: un dato verdadero e informativo que no debe borrarse. Los demás son errores: 1.72 se capturó en metros, 17.2 tiene el punto decimal desplazado, 0 se usó para decir "no se midió" y 1680 está en milímetros. Los primeros describen la realidad; los segundos la deforman.

Las reglas estadísticas de detección (las cercas de Tukey o las puntuaciones z) responden a la pregunta "¿está lejos de los demás?", no a "¿es imposible?". Marcan al jugador de baloncesto igual que a los errores y, si los errores son muy grandes, pueden dejar de ver a los menos extremos porque inflan la desviación estándar. La distinción requiere reglas de dominio (una estatura adulta no mide 17 cm) y, cuando es posible, una explicación del error que permita corregirlo en vez de borrarlo.

## Definición

:::definicion[Atípico y error de captura]
- Un **valor atípico** es una observación que se aleja mucho del resto de los datos pero es un valor posible del fenómeno medido.
- Un **error de captura** es un valor que no corresponde a la medición real por un fallo al registrar, convertir o transmitir el dato (unidades, punto decimal, códigos especiales, signos).
:::

Reglas usuales para marcar valores sospechosos:

$$
\text{Tukey: } x \notin [\,Q_1 - 1.5\,\mathrm{RIC},\ Q_3 + 1.5\,\mathrm{RIC}\,], \qquad \text{z: } \left|\frac{x - \bar{x}}{s}\right| > 3, \qquad \text{dominio: } x \notin [a, b].
$$

:::nota[Qué significa cada símbolo]
- $x$: valor que se revisa.
- $Q_1$, $Q_3$: primer y tercer cuartil de los datos.
- $\mathrm{RIC} = Q_3 - Q_1$: rango intercuartílico.
- $\bar{x}$, $s$: media y desviación estándar muestrales, calculadas con todos los datos.
- $[a, b]$: rango de valores físicamente o lógicamente posibles, fijado por el conocimiento del dominio.
:::

## Cómo usar la visualización

Cada punto es una captura, en el orden en que llegó; el eje vertical usa una escala logarítmica simétrica para que quepan a la vez el 0, los valores ordinarios y los errores enormes. El color dice qué es cada valor en realidad: gris si es ordinario, azul si es un extremo verdadero y rojo si es un error. Un anillo naranja indica que la regla lo marca, y las líneas punteadas son sus límites. Las lecturas cuentan errores detectados, errores omitidos y falsas alarmas.

Experimentos sugeridos: en estaturas, comparar las tres reglas; la regla z, inflada por el valor de 1680, solo marca ese error. Las figuras de Propiedades y Errores comunes repiten el ejercicio con temperaturas y con montos de compra; en estos últimos, la regla de Tukey marca compras grandes legítimas y deja pasar una devolución negativa.

## Ejemplo

Las 26 estaturas tienen $Q_1 = 159.25$ y $Q_3 = 172.75$ cm.

1. $\mathrm{RIC} = 172.75 - 159.25 = 13.5$; cercas: $159.25 - 1.5(13.5) = 139$ y $172.75 + 1.5(13.5) = 193$.
2. Quedan fuera 203, 1.72, 17.2, 0 y 1680: los cuatro errores y el jugador de baloncesto.
3. Con la regla z: $\bar{x} = 207.7$ y $s = 305.0$, porque el valor de 1680 los infla. El límite superior es $207.7 + 3(305.0) = 1122.9$ y el inferior es negativo: solo se marca 1680.
4. Con el dominio $[100, 230]$ cm se marcan exactamente los cuatro errores, y el jugador de 203 cm se conserva.
5. Cada error se corrige si su causa es clara: $1.72 \to 172$, $17.2 \to 172$, $1680 \to 168$; el 0 se convierte en faltante.

:::figura[Estaturas con la regla del dominio: los cuatro errores quedan fuera del rango plausible y los dos extremos verdaderos, 203 y 148 cm, se conservan.]{componente="DataQualityTable"}
```yaml
modo: atipicos
caso: estatura
regla: dominio
```
:::

## Propiedades

- **La regla de Tukey es resistente.** Los cuartiles casi no cambian aunque haya valores enormes, así que sus cercas siguen siendo razonables.
- **La regla z sufre enmascaramiento.** Un valor muy grande infla $\bar{x}$ y $s$, y los demás valores sospechosos quedan dentro de los límites.

:::figura[Enmascaramiento en estaturas: con la regla z, el valor de 1680 infla la desviación estándar y los demás errores pasan sin marca.]{componente="DataQualityTable"}
```yaml
modo: atipicos
caso: estatura
regla: z
```
:::

- **Las reglas estadísticas no conocen las unidades.** Una temperatura de 95 puede ser legítima en grados Fahrenheit y un error en grados Celsius; solo el dominio lo decide.

:::figura[Temperaturas en Mérida con las cercas de Tukey: marcan el código de error 999, el valor por defecto de -40 y la lectura en Fahrenheit, y conservan la onda de calor de 41.5 °C.]{componente="DataQualityTable"}
```yaml
modo: atipicos
caso: temperatura
regla: iqr
```
:::

## Errores comunes

- **Borrar todo lo que marca una regla estadística.** Se eliminan extremos verdaderos, que suelen ser los casos más informativos: compras grandes, ondas de calor, pacientes graves.
- **Confiar en que las reglas encuentran todos los errores.** Un monto negativo puede quedar dentro de las cercas de Tukey cuando la distribución es muy asimétrica.
- **Corregir sin evidencia.** Multiplicar por 100 un valor de 1.72 es razonable; inventar una corrección para un 0 no lo es: se trata como faltante.

:::figura[Montos de compra con las cercas de Tukey: se marcan dos compras grandes legítimas y la devolución de -350 pesos queda sin marcar.]{componente="DataQualityTable"}
```yaml
modo: atipicos
caso: montos
regla: iqr
```
:::

## Conexiones

Las reglas estadísticas se estudian en [[deteccion-de-valores-atipicos-por-rango-intercuartilico]] y en [[deteccion-de-valores-atipicos-por-puntuacion-z-y-z-modificada]]: las cercas usan el [[rango-intercuartilico]] y la regla z, las [[puntuaciones-z-muestrales]]; el [[diagrama-de-caja]] dibuja las mismas cercas. La regla de dominio es una regla de rango de la [[validacion-de-esquema]], y los errores encontrados afectan la exactitud descrita en [[dimensiones-de-la-calidad-de-datos]]. Para limitar la influencia de los extremos verdaderos sin borrarlos se usa la [[winsorizacion]]. Las [[colas-ligeras-y-pesadas-en-datos|colas pesadas]] producen muchos atípicos legítimos.

## Formulario

:::formula[Cercas de Tukey]
$$
[\,Q_1 - 1.5\,\mathrm{RIC},\ Q_3 + 1.5\,\mathrm{RIC}\,], \qquad \mathrm{RIC} = Q_3 - Q_1
$$

- $Q_1$, $Q_3$: primer y tercer cuartil.
- $\mathrm{RIC}$: rango intercuartílico.
:::

:::formula[Regla de la puntuación z]
$$
|z| = \left|\frac{x - \bar{x}}{s}\right| > 3
$$

- $x$: valor revisado.
- $\bar{x}$, $s$: media y desviación estándar muestrales.
:::

:::formula[Regla de dominio]
$$
x \notin [a, b]
$$

- $a$, $b$: límites de los valores posibles según el fenómeno medido.
:::
