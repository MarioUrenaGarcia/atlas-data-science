---
id: validacion-de-esquema
titulo: Validación de esquema
titulo_en: Schema validation
alias:
  - esquema de datos
  - reglas de validación
  - contrato de datos
  - data validation
modulo: 12
submodulo: '12.2'
orden: 4
nivel: basico
prerrequisitos:
  - dimensiones-de-la-calidad-de-datos
etiquetas:
  - calidad de datos
  - validez
  - reglas
  - tipos de datos
resumen: >
  Un esquema declara, para cada campo, su tipo, si es obligatorio, su rango, su formato y sus valores
  permitidos. Validar es revisar cada celda contra esas reglas y reportar las filas que las violan.
formula: 'V = \frac{1}{n}\sum_{i=1}^{n} \prod_{j=1}^{p} \mathbf{1}\{x_{ij} \in A_j\}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: esquema
    caso: pacientes
referencias:
  - clave: lohr
publicado: true
---

## Intuición

Antes de que un hospital use una tabla de consultas, alguien debería poder responder: ¿qué es un número de expediente válido?, ¿la edad puede tener decimales?, ¿qué valores admite la columna "sexo"?, ¿en qué formato van las fechas? Escribir esas respuestas de forma explícita produce un **esquema**: un contrato entre quien produce los datos y quien los usa.

Con el esquema escrito, revisar los datos deja de ser una inspección visual y se vuelve una lista de pruebas automáticas que se ejecutan cada vez que llega una tabla nueva. Las pruebas no garantizan que los datos sean ciertos (una edad de 45 puede estar equivocada y pasar todas las reglas), pero detectan de inmediato lo imposible: un expediente con un dígito de menos, una edad de 134 años, una fecha escrita en otro formato o "Femenino" donde solo se admiten "F" y "M". Detenerse ante esos errores evita que se propaguen al análisis, donde son mucho más difíciles de rastrear.

## Definición

:::definicion[Esquema y validación]
Un **esquema** asigna a cada campo $j = 1, \dots, p$ un conjunto de valores admisibles $A_j$, definido por reglas: obligatoriedad, tipo (entero, decimal, texto, fecha), rango $[a_j, b_j]$, patrón de formato y lista de valores permitidos. Una celda $x_{ij}$ es **válida** si $x_{ij} \in A_j$, y una fila es válida si todas sus celdas lo son. La proporción de filas válidas es

$$
V = \frac{1}{n}\sum_{i=1}^{n} \prod_{j=1}^{p} \mathbf{1}\{x_{ij} \in A_j\}.
$$
:::

:::nota[Qué significa cada símbolo]
- $n$: número de filas; $p$: número de campos.
- $x_{ij}$: valor de la fila $i$ en el campo $j$.
- $A_j$: conjunto de valores que el esquema admite para el campo $j$.
- $a_j$, $b_j$: límites inferior y superior del rango, cuando el campo es numérico.
- $\mathbf{1}\{\cdot\}$: indicadora; vale $1$ si la condición se cumple y $0$ si no.
- $\prod$: producto; la fila cuenta como válida solo si todas sus indicadoras valen $1$.
- $V$: proporción de filas válidas.
:::

## Cómo usar la visualización

El encabezado de cada columna resume sus reglas. Al reproducir, las filas se validan una por una: las celdas que cumplen se sombrean en verde y las que violan alguna regla, en rojo, con la regla incumplida listada debajo de la tabla. Las lecturas cuentan filas válidas, filas con violaciones y el total de violaciones. La tabla de datos al pie muestra el esquema completo.

Experimento sugerido: comparar la fila del peso vacío con la del expediente vacío; el peso no es obligatorio, así que un vacío no es una violación, mientras que el expediente sí lo es.

## Ejemplo

El esquema de pacientes exige: expediente obligatorio con formato EXP-0000; edad obligatoria, entera, entre 0 y 120; sexo F o M; peso entre 1 y 300 kg si se registra; fecha AAAA-MM-DD.

1. "EXP-103": falta un dígito, viola el patrón.
2. Edad "38.5": no es entera.
3. Sexo "Femenino": no está entre los valores permitidos.
4. Fecha "15/03/2025": formato distinto al declarado.
5. Edad "134": fuera del rango.
6. Expediente vacío y peso 0.75: viola la obligatoriedad y el rango del peso (probablemente se capturó en otra unidad).

Solo 2 de 8 filas son válidas: $V = 2/8 = 0.25$, con 7 violaciones en total.

:::figura[El registro de pacientes validado completo: 2 filas válidas y 7 violaciones.]{componente="DataQualityTable"}
```yaml
modo: esquema
caso: pacientes
```
:::

## Propiedades

- **La validez es necesaria, no suficiente.** Todas las reglas pueden cumplirse con valores falsos; la exactitud se comprueba con otra fuente.
- **Una celda puede violar varias reglas a la vez.** La cantidad "dos" en un pedido no es entera y tampoco está en el rango numérico.
- **Las reglas deben reflejar la escala de la variable.** Un rango tiene sentido en variables de intervalo o de razón; en una nominal, la regla adecuada es la lista de valores permitidos.

:::figura[Pedidos de una tienda en línea: la cantidad "dos" viola dos reglas y el código postal de 4 dígitos viola el patrón.]{componente="DataQualityTable"}
```yaml
modo: esquema
caso: pedidos
```
:::

## Errores comunes

- **Validar solo los tipos.** Que la edad sea un número no impide que valga 134; las reglas de rango y de formato son las que encuentran la mayoría de los errores.
- **Corregir en silencio.** Convertir "Femenino" en "F" puede ser correcto, pero si se hace sin registrarlo, nadie sabrá que la fuente produce valores fuera del esquema.
- **Escribir reglas demasiado estrictas.** Un rango de edad de 18 a 65 rechaza pacientes reales menores o mayores; el esquema describe lo posible, no lo habitual.

:::figura[Error de validar solo tipos: si únicamente se revisan obligatoriedad y tipo entero, la edad 134 y el sexo "Femenino" pasan sin aviso y 6 de las 8 filas parecen válidas.]{componente="DataQualityTable"}
```yaml
modo: esquema
caso: pacientes
soloTipos: true
```
:::

## Conexiones

La validación mide la dimensión de validez de [[dimensiones-de-la-calidad-de-datos]]. Las reglas dependen de la [[escalas-nominal-ordinal-de-intervalo-y-de-razon|escala de medición]] de cada campo y de si la variable es [[datos-discretos-y-continuos|discreta o continua]]. Una lista de valores permitidos evita las [[inconsistencias-y-estandarizacion-de-valores|inconsistencias de categorías]], y los valores que pasan el esquema pero son sospechosos se estudian en [[valores-atipicos-vs-errores-de-captura]]. Cada regla es un predicado sobre el campo, como los de la [[funcion-indicadora-y-funcion-escalon|función indicadora]].

## Formulario

:::formula[Proporción de filas válidas]
$$
V = \frac{1}{n}\sum_{i=1}^{n} \prod_{j=1}^{p} \mathbf{1}\{x_{ij} \in A_j\}
$$

- $n$, $p$: número de filas y de campos.
- $x_{ij}$: celda de la fila $i$ y el campo $j$.
- $A_j$: valores admisibles del campo $j$.
- $\mathbf{1}\{\cdot\}$: indicadora de que la celda es válida.
:::

:::formula[Regla de rango]
$$
x_{ij} \in A_j \iff a_j \le x_{ij} \le b_j
$$

- $a_j$, $b_j$: límites del rango permitido del campo $j$.
:::
