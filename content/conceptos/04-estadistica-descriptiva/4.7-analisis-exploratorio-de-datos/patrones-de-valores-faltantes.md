---
id: patrones-de-valores-faltantes
titulo: Patrones de valores faltantes
titulo_en: Missing data patterns
alias:
  - datos faltantes
  - MCAR, MAR y MNAR
  - mecanismos de pérdida
  - matriz de faltantes
modulo: 4
submodulo: '4.7'
orden: 8
nivel: basico
prerrequisitos:
  - perfilado-de-datos
etiquetas:
  - calidad de datos
  - faltantes
  - sesgo
  - exploración
resumen: >
  Los patrones de faltantes describen qué valores faltan y en qué combinaciones. Su mecanismo puede ser
  completamente al azar (MCAR), al azar dado lo observado (MAR) o dependiente del valor faltante (MNAR), y
  eso decide si ignorarlos sesga.
formula: 'P(R \mid Y_{\text{obs}}, Y_{\text{mis}}) = P(R)\ \text{(MCAR)},\quad = P(R \mid Y_{\text{obs}})\ \text{(MAR)}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: faltantes
referencias:
  - clave: gelman-bda
  - clave: murphy
publicado: true
---

## Intuición

En las ventas de viviendas falta la antigüedad de 27 casas. La pregunta importante no es cuántas faltan sino por qué. Si se perdieron al azar, por ejemplo por un archivo dañado, las casas con antigüedad registrada son una muestra representativa y basta con analizarlas. Si faltan sobre todo en una zona, como ocurre aquí con el Sur, las casas con dato están sobrerrepresentadas en el Norte y el Centro, y cualquier promedio sin ajustar por zona estará sesgado. Y si faltaran precisamente en las casas más viejas, porque los vendedores prefieren no decirlo, ningún ajuste con los datos disponibles corregiría del todo el sesgo.

Una **matriz de faltantes**, con una fila por registro y las celdas vacías marcadas, permite ver cuántos faltan, en qué columnas y en qué combinaciones (los **patrones**). Ordenar las filas por otra variable revela si los huecos se concentran en ciertos grupos, una pista del mecanismo.

## Definición

:::definicion[Patrón y mecanismo de faltantes]
Sea $R_{ij} = 1$ si el valor de la variable $j$ en el registro $i$ falta y $0$ si está observado. El **patrón** de faltantes del registro $i$ es el vector $(R_{i1}, \dots, R_{ip})$. Al dividir los datos en la parte observada $Y_{\text{obs}}$ y la faltante $Y_{\text{mis}}$, el **mecanismo** es la distribución de $R$ y se clasifica en:

- **MCAR** (faltantes completamente al azar): $P(R \mid Y_{\text{obs}}, Y_{\text{mis}}) = P(R)$.
- **MAR** (faltantes al azar dado lo observado): $P(R \mid Y_{\text{obs}}, Y_{\text{mis}}) = P(R \mid Y_{\text{obs}})$.
- **MNAR** (faltantes no al azar): la probabilidad de faltar depende de $Y_{\text{mis}}$ aun conociendo $Y_{\text{obs}}$.
:::

Consecuencias para el análisis de casos completos (descartar los registros con faltantes): bajo MCAR es insesgado pero pierde información; bajo MAR puede sesgarse y se corrige usando las variables observadas que explican la pérdida; bajo MNAR se sesga y la corrección requiere supuestos que los datos no pueden verificar.

:::nota[Qué significa cada símbolo]
- $R_{ij}$: indicador de que el valor de la variable $j$ en el registro $i$ falta.
- $p$: número de variables.
- $R$: el conjunto de indicadores de faltantes.
- $Y_{\text{obs}}$: valores observados; $Y_{\text{mis}}$: valores que faltan.
- $P(\cdot \mid \cdot)$: probabilidad condicional.
:::

## Cómo usar la visualización

La matriz muestra las 200 ventas de viviendas, una fila por registro y una columna por variable, con los faltantes en color. Las filas se agregan por tandas y el panel reporta el porcentaje de faltantes por columna y el número de patrones distintos.

El selector **Orden de las filas** permite dejar el orden original, agrupar por patrón o ordenar por zona.

Experimentos sugeridos:

1. Con el orden original, los faltantes de antigüedad parecen dispersos.
2. Ordenar por zona: los faltantes se concentran en el bloque del Sur, señal de que no son MCAR.
3. Agrupar por patrón: solo hay dos patrones, completo y sin antigüedad.

## Ejemplo

Seis registros de una encuesta con tres variables (edad, ingreso, escolaridad), con F donde falta el dato:

| Registro | Edad | Ingreso | Escolaridad |
| --- | --- | --- | --- |
| 1 | 34 | 18 | Prepa |
| 2 | 51 | F | Licenciatura |
| 3 | 27 | 12 | F |
| 4 | 45 | F | Licenciatura |
| 5 | 38 | 21 | Prepa |
| 6 | 60 | F | F |

1. Faltantes por variable: edad 0, ingreso 3, escolaridad 2.
2. Patrones $(R_{\text{edad}}, R_{\text{ingreso}}, R_{\text{escolaridad}})$: $(0,0,0)$ dos veces, $(0,1,0)$ dos veces, $(0,0,1)$ una vez y $(0,1,1)$ una vez: cuatro patrones distintos.
3. Casos completos: solo 2 de 6.
4. Los ingresos faltan en los registros de 45, 51 y 60 años, mientras que las edades con ingreso son 27, 34 y 38: la pérdida parece depender de la edad observada, un indicio de MAR.

:::figura[La matriz de la encuesta del ejemplo, con sus cuatro patrones al agrupar las filas.]{componente="DataQualityTable"}
```yaml
modo: faltantes
columnas:
  - nombre: Edad
    valores: [34, 51, 27, 45, 38, 60]
  - nombre: Ingreso
    valores: [18, null, 12, null, 21, null]
  - nombre: Escolaridad
    valores: [Prepa, Licenciatura, null, Licenciatura, Prepa, null]
orden: patron
```
:::

## Propiedades

**MCAR: los datos observados representan a todos.** La media de los ingresos reportados coincide, salvo variación aleatoria, con la verdadera.

:::figura[Faltantes completamente al azar: los ingresos no reportados se reparten por toda la nube y la media de los reportados casi coincide con la verdadera.]{componente="DataQualityTable"}
```yaml
modo: mecanismo
mecanismo: mcar
```
:::

**MAR: la pérdida depende de una variable observada.** Aquí los jóvenes reportan menos su ingreso; como el ingreso crece con la edad, la media de los reportados sale alta, pero el sesgo se corrige comparando dentro de cada grupo de edad.

:::figura[Faltantes al azar dada la edad: faltan sobre todo ingresos de personas jóvenes, de modo que la media de los reportados queda por encima de la verdadera.]{componente="DataQualityTable"}
```yaml
modo: mecanismo
mecanismo: mar
```
:::

**MNAR: la pérdida depende del valor que falta.** Los ingresos altos se ocultan más y la media de los reportados subestima la verdadera en cualquier grupo.

:::figura[Faltantes no al azar: los ingresos altos se reportan menos y la media de los reportados queda claramente por debajo de la verdadera.]{componente="DataQualityTable"}
```yaml
modo: mecanismo
mecanismo: mnar
```
:::

## Errores comunes

- **Suponer MCAR sin revisar.** Basta comparar los registros con y sin faltante en las variables observadas: si difieren, no es MCAR.
- **Borrar todos los registros incompletos sin pensar.** Con varias variables se pierden muchos casos y, si el mecanismo no es MCAR, se introduce sesgo.
- **Creer que los datos pueden probar que no es MNAR.** Distinguir MAR de MNAR requiere conocer lo que falta; se justifica con conocimiento del proceso, no con los datos observados.

:::figura[Revisar el mecanismo ordenando por una variable observada: en las ventas de viviendas, al ordenar por zona, los faltantes de antigüedad se agrupan en el Sur.]{componente="DataQualityTable"}
```yaml
modo: faltantes
orden: primera
```
:::

## Conexiones

Los faltantes se detectan en el [[perfilado-de-datos]] y son parte del [[analisis-exploratorio-de-datos]]. Su mecanismo determina si los estadísticos descriptivos de los casos observados, como la [[media-aritmetica]], son representativos de la [[poblacion-y-muestra|población]]. El sesgo por pérdida no aleatoria es un caso de selección de la muestra.

## Formulario

:::formula[Indicador de faltante]
$$
R_{ij} = \mathbf{1}\{\text{el valor de la variable } j \text{ en el registro } i \text{ falta}\}
$$

- $\mathbf{1}\{\cdot\}$: indicadora, vale 1 si se cumple la condición y 0 si no.
:::

:::formula[MCAR]
$$
P(R \mid Y_{\text{obs}}, Y_{\text{mis}}) = P(R)
$$

- La pérdida no depende de ningún valor, observado o faltante.
:::

:::formula[MAR]
$$
P(R \mid Y_{\text{obs}}, Y_{\text{mis}}) = P(R \mid Y_{\text{obs}})
$$

- La pérdida depende solo de valores observados.
:::

:::formula[Proporción de casos completos]
$$
\frac{1}{n}\sum_{i=1}^{n} \mathbf{1}\Big\{\sum_{j=1}^{p} R_{ij} = 0\Big\}
$$

- $n$: número de registros; $p$: número de variables; un caso es completo si no le falta ninguna variable.
:::
