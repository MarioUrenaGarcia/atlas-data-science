---
id: inconsistencias-y-estandarizacion-de-valores
titulo: Inconsistencias y estandarización de valores
titulo_en: Inconsistent values and standardization
alias:
  - estandarización de categorías
  - normalización de texto
  - homologación de valores
  - limpieza de categorías
modulo: 12
submodulo: '12.2'
orden: 3
nivel: basico
prerrequisitos:
  - dimensiones-de-la-calidad-de-datos
etiquetas:
  - calidad de datos
  - variables categóricas
  - limpieza de texto
  - consistencia
resumen: >
  Una misma categoría escrita de varias formas (mayúsculas, acentos, abreviaturas) se cuenta como varias.
  Estandarizar aplica pasos de limpieza y un diccionario de equivalencias para que cada categoría tenga un solo valor.
formula: 'K_s = \left|\{\, f_s(v_i) : i = 1, \dots, n \,\}\right|'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: estandarizacion
    caso: ciudades
referencias:
  - clave: lohr
  - clave: agresti
publicado: true
---

## Intuición

Un formulario pide la ciudad de residencia en un campo de texto libre. Las personas escriben "Ciudad de México", "ciudad de mexico", "CDMX", "Cd. de México" y hasta " Ciudad de México " con espacios de más. Una computadora compara cadenas carácter por carácter, así que cuenta cinco ciudades distintas donde hay una. Un gráfico de barras de residencia mostraría a la capital repartida en barras pequeñas, del mismo tamaño que las de ciudades mucho menos frecuentes en los datos.

**Estandarizar** es decidir una forma canónica para cada categoría y llevar todas las variantes a esa forma. Una parte del trabajo es mecánica y se aplica a todos los valores por igual: quitar espacios sobrantes, pasar a minúsculas, quitar acentos y signos de puntuación. Otra parte requiere conocimiento del dominio: nadie puede deducir de las letras que "GDL" es Guadalajara o que "bachillerato" y "preparatoria" son el mismo nivel; para eso se usa un diccionario de equivalencias revisado por una persona.

## Definición

:::definicion[Estandarización de valores]
Sea $v_1, \dots, v_n$ una columna de valores de texto. Una **estandarización** es una función $f$ que asigna a cada valor su forma canónica, construida como la composición de pasos de limpieza y un diccionario:

$$
f = D \circ g_s \circ \dots \circ g_1 .
$$

El número de categorías distintas después de los primeros $s$ pasos es

$$
K_s = \left|\{\, f_s(v_i) : i = 1, \dots, n \,\}\right|, \qquad f_s = g_s \circ \dots \circ g_1 .
$$

Una **inconsistencia** es la existencia de dos valores distintos $v_i \ne v_j$ que representan la misma categoría.
:::

:::nota[Qué significa cada símbolo]
- $v_i$: valor original de la fila $i$.
- $n$: número de filas.
- $g_1, \dots, g_s$: pasos de limpieza, por ejemplo quitar espacios o pasar a minúsculas.
- $D$: diccionario que lleva variantes conocidas (como "cdmx") a la forma canónica.
- $\circ$: composición de funciones; $g_2 \circ g_1$ aplica primero $g_1$ y luego $g_2$.
- $f_s$: estandarización parcial con los primeros $s$ pasos.
- $K_s$: número de categorías distintas tras $s$ pasos; $|\cdot|$ es el número de elementos de un conjunto.
:::

## Cómo usar la visualización

La tabla compara cada valor original, entre comillas para que se vean los espacios, con su valor estandarizado; las celdas que ya cambiaron se sombrean en verde. Al reproducir se aplica un paso a la vez: las etiquetas superiores indican el paso actual y las barras muestran cuántos registros tiene cada categoría. Cuando dos variantes quedan iguales, sus barras se funden en una.

Experimento sugerido: avanzar paso a paso y observar cuántas categorías elimina cada paso; el diccionario, al final, es el que une abreviaturas como "GDL" o "Mty" que ninguna regla mecánica puede reconocer.

## Ejemplo

La columna de ciudades tiene 16 registros y $K_0 = 13$ valores distintos.

1. Quitar espacios sobrantes: " Ciudad de México " se une con "Ciudad de México", $K_1 = 12$.
2. Pasar a minúsculas: "CIUDAD DE MÉXICO", "Guadalajara" y "guadalajara", "Monterrey" y "monterrey" se unen, $K_2 = 9$.
3. Quitar acentos: "ciudad de méxico" y "ciudad de mexico" se unen, $K_3 = 8$.
4. Quitar puntuación: "guadalajara." se une con "guadalajara", $K_4 = 7$.
5. Diccionario: "cdmx", "cd de mexico", "gdl" y "mty" pasan a su forma canónica, $K_5 = 3$.

Quedan 3 ciudades con 7, 5 y 4 registros. Sin estandarizar, la ciudad más frecuente parecía tener 2 registros.

:::figura[Las ciudades estandarizadas por completo: de 13 valores distintos quedan 3 categorías.]{componente="DataQualityTable"}
```yaml
modo: estandarizacion
caso: ciudades
```
:::

## Propiedades

- **$K_s$ nunca aumenta.** Cada paso es una función: puede unir valores, pero no separar uno en dos.
- **El orden de los pasos importa.** El diccionario debe aplicarse al final, cuando sus claves ya están en minúsculas y sin acentos; de lo contrario habría que escribir cada variante de cada clave.
- **Los pasos mecánicos no bastan.** Las abreviaturas y los sinónimos solo se resuelven con conocimiento del dominio.

:::figura[Con solo los cuatro pasos mecánicos, la escolaridad declarada pasa de 14 a 9 valores; las abreviaturas y los sinónimos siguen separados.]{componente="DataQualityTable"}
```yaml
modo: estandarizacion
caso: escolaridad
pasos: 4
```
:::

:::figura[Con el diccionario, que reconoce que bachillerato y preparatoria son el mismo nivel, la escolaridad queda en 4 categorías.]{componente="DataQualityTable"}
```yaml
modo: estandarizacion
caso: escolaridad
```
:::

## Errores comunes

- **Quitar información útil al limpiar.** Pasar a minúsculas un código como "Mg" (magnesio) y "mg" (miligramo) une cosas distintas; los pasos se eligen según la columna.
- **Construir el diccionario a partir de lo que "parece" igual.** "Posgrado" no siempre es maestría; las equivalencias deben venir de una definición, no de una suposición.
- **Estandarizar solo al analizar.** Si la captura sigue siendo libre, las variantes vuelven a aparecer; la solución duradera es una lista cerrada de opciones en el formulario.

:::figura[Error de detenerse en la limpieza mecánica: tras los dos primeros pasos, la capital sigue repartida en varias categorías.]{componente="DataQualityTable"}
```yaml
modo: estandarizacion
caso: ciudades
pasos: 2
```
:::

## Conexiones

Las inconsistencias afectan la dimensión de consistencia de [[dimensiones-de-la-calidad-de-datos]] y la misma normalización sirve para encontrar [[registros-duplicados]]. Las variables afectadas son [[datos-cualitativos-y-cuantitativos|cualitativas]], y su frecuencia por categoría es la que se dibuja en un [[grafico-de-barras]]. Una lista cerrada de valores permitidos se declara en la [[validacion-de-esquema]].

## Formulario

:::formula[Estandarización como composición]
$$
f = D \circ g_s \circ \dots \circ g_1
$$

- $g_1, \dots, g_s$: pasos de limpieza en el orden en que se aplican.
- $D$: diccionario de equivalencias.
- $f$: función que da la forma canónica de cada valor.
:::

:::formula[Categorías distintas tras s pasos]
$$
K_s = \left|\{\, f_s(v_i) : i = 1, \dots, n \,\}\right|
$$

- $v_i$: valor original de la fila $i$.
- $f_s$: estandarización con los primeros $s$ pasos.
- $K_s$: número de valores distintos resultantes.
:::
