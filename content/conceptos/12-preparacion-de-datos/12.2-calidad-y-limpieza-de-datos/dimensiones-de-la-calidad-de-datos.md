---
id: dimensiones-de-la-calidad-de-datos
titulo: Dimensiones de la calidad de datos
titulo_en: Data quality dimensions
alias:
  - calidad de datos
  - completitud, validez y exactitud
  - perfil de calidad
modulo: 12
submodulo: '12.2'
orden: 1
nivel: basico
prerrequisitos:
  - metodologia-crisp-dm
  - perfilado-de-datos
etiquetas:
  - calidad de datos
  - limpieza
  - auditoría de datos
  - completitud
resumen: >
  La calidad de un conjunto de datos se evalúa en dimensiones separadas: completitud, validez, exactitud,
  consistencia, unicidad y oportunidad; cada una se mide como la proporción de celdas o filas que la cumplen.
formula: 'Q_d = 1 - \frac{a_d}{N_d}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: dimensiones
    caso: clientes
referencias:
  - clave: lohr
  - clave: kohavi
publicado: true
---

## Intuición

Decir que una base de datos "está sucia" no ayuda a limpiarla. Un registro de clientes puede tener correos vacíos, una edad de 230 años, una edad posible pero equivocada, una compra fechada antes de que el cliente existiera, el mismo cliente dos veces y datos que nadie actualiza desde hace años. Son problemas distintos, se detectan con pruebas distintas y se corrigen de maneras distintas.

Las **dimensiones de la calidad** separan esos problemas en preguntas independientes. ¿Falta algo? ¿Lo que hay respeta el formato y el rango? ¿Coincide con la realidad? ¿Los campos de un registro concuerdan entre sí? ¿Cada entidad aparece una vez? ¿El dato está al día? Medir cada dimensión por separado permite saber cuál limita el análisis: una tabla puede estar completa y ser inútil porque sus valores están desactualizados, o tener huecos y ser confiable en todo lo demás.

## Definición

:::definicion[Dimensiones de la calidad de datos]
- **Completitud:** los valores que deben existir están presentes.
- **Validez:** cada valor cumple el tipo, el formato, el dominio y el rango declarados.
- **Exactitud:** el valor coincide con la realidad o con una fuente de referencia confiable.
- **Consistencia:** los campos de un registro, o de registros relacionados, no se contradicen.
- **Unicidad:** cada entidad aparece una sola vez.
- **Oportunidad:** el dato está disponible y actualizado a tiempo para el uso previsto.
:::

Cada dimensión $d$ se cuantifica con la proporción de unidades que la cumplen:

$$
Q_d = 1 - \frac{a_d}{N_d},
$$

donde la unidad son las celdas para completitud, validez y exactitud, y las filas para consistencia, unicidad y oportunidad.

:::nota[Qué significa cada símbolo]
- $d$: dimensión evaluada, por ejemplo completitud.
- $a_d$: número de unidades (celdas o filas) con al menos un problema de esa dimensión.
- $N_d$: número total de unidades revisadas para esa dimensión.
- $Q_d$: puntaje de la dimensión, entre $0$ (todas fallan) y $1$ (ninguna falla).
:::

## Cómo usar la visualización

La tabla se audita una dimensión a la vez. En cada paso, las celdas o filas que fallan la dimensión actual se marcan con un borde naranja y quedan sombreadas en rojo; la lista debajo de la tabla explica cada problema. El encabezado muestra el cálculo del puntaje de la dimensión actual y las barras acumulan los puntajes de las dimensiones ya revisadas.

Experimentos sugeridos: detenerse en exactitud y comparar la fila marcada con las demás, porque su edad es válida y aun así es incorrecta; observar que la consistencia, la unicidad y la oportunidad se puntúan por filas, así que un solo problema baja el puntaje 0.1. La tabla de sensores, que aparece en las figuras de Propiedades y Errores comunes, muestra una fila que falla en exactitud y en consistencia a la vez.

## Ejemplo

El registro de clientes de una aseguradora tiene 10 filas y 7 columnas, es decir, $70$ celdas.

1. **Completitud:** faltan un correo y una edad, $a = 2$ celdas. $Q = 1 - 2/70 = 0.971$.
2. **Validez:** una edad de 230 años y un correo sin dominio completo, $a = 2$ celdas. $Q = 0.971$.
3. **Exactitud:** una edad de 23 que, según el registro civil, es 32, $a = 1$ celda. $Q = 1 - 1/70 = 0.986$.
4. **Consistencia:** una cliente con última compra anterior a su fecha de alta, $a = 1$ fila. $Q = 1 - 1/10 = 0.9$.
5. **Unicidad:** el identificador C02 aparece dos veces, $a = 1$ fila sobrante. $Q = 0.9$.
6. **Oportunidad:** un registro no se actualiza desde 2021, $Q = 0.9$.

Las dimensiones por filas tienen puntajes más bajos porque cada problema afecta a una fila completa de solo 10.

:::figura[El registro de clientes auditado completo: seis puntajes, uno por dimensión, con los problemas de cada una marcados en la tabla.]{componente="DataQualityTable"}
```yaml
modo: dimensiones
caso: clientes
```
:::

## Propiedades

- **Las dimensiones son independientes.** Un valor puede ser válido y no exacto (edad 23 en lugar de 32) o exacto y no oportuno (la dirección correcta de hace tres años).

:::figura[Exactitud por separado: la edad 23 cumple el rango de 0 a 120, pero no coincide con la fuente de referencia.]{componente="DataQualityTable"}
```yaml
modo: dimensiones
caso: clientes
enfoque: exactitud
```
:::

- **La validez se comprueba con reglas; la exactitud necesita una referencia externa.** Por eso la exactitud suele medirse en una muestra verificada a mano.
- **Una misma fila puede fallar en varias dimensiones.** Los puntajes no se suman ni se restan; se reportan juntos, como un perfil.

:::figura[Lecturas de estaciones de calidad del aire: la estación apagada falla en exactitud (ceros registrados) y en consistencia (temperatura y humedad imposibles a la vez).]{componente="DataQualityTable"}
```yaml
modo: dimensiones
caso: sensores
```
:::

## Errores comunes

- **Reducir la calidad a la completitud.** Una tabla sin celdas vacías puede estar llena de ceros que significan "sin dato", como la estación apagada.
- **Promediar las dimensiones en un solo número.** Un índice de 0.95 puede esconder que la oportunidad es mala, y eso basta para invalidar un tablero que se usa a diario.
- **Corregir sin medir.** Limpiar sin registrar los puntajes antes y después impide saber qué tan grave era el problema y si la limpieza lo resolvió.

:::figura[Error de reducir la calidad a la completitud: en la tabla de sensores, la dimensión de completitud solo detecta dos celdas vacías y no ve los ceros de la estación apagada.]{componente="DataQualityTable"}
```yaml
modo: dimensiones
caso: sensores
enfoque: completitud
```
:::

## Conexiones

El [[perfilado-de-datos]] produce los resúmenes por columna en los que se basa la auditoría. La auditoría de calidad ocurre en la fase de comprensión de los datos de la [[metodologia-crisp-dm]] y presupone una tabla con una fila por [[unidad-de-observacion-y-datos-ordenados|unidad de observación]]. Cada dimensión tiene su tratamiento: la unicidad en [[registros-duplicados]], la validez en [[validacion-de-esquema]], la consistencia de categorías en [[inconsistencias-y-estandarizacion-de-valores]], la completitud en [[mecanismos-de-datos-faltantes]] y la exactitud en [[valores-atipicos-vs-errores-de-captura]].

## Formulario

:::formula[Puntaje de una dimensión]
$$
Q_d = 1 - \frac{a_d}{N_d}
$$

- $d$: dimensión de calidad.
- $a_d$: unidades con algún problema de la dimensión $d$.
- $N_d$: unidades revisadas (celdas o filas, según la dimensión).
- $Q_d$: proporción de unidades que cumplen la dimensión.
:::

:::formula[Completitud de una columna]
$$
Q_{\text{comp}}(j) = \frac{1}{n}\sum_{i=1}^{n} \mathbf{1}\{x_{ij} \text{ observado}\}
$$

- $j$: columna evaluada.
- $n$: número de filas.
- $x_{ij}$: valor de la fila $i$ en la columna $j$.
- $\mathbf{1}\{\cdot\}$: indicadora, vale $1$ si el valor está presente y $0$ si falta.
:::
