---
id: escalas-nominal-ordinal-de-intervalo-y-de-razon
titulo: Escalas nominal, ordinal, de intervalo y de razón
titulo_en: Nominal, ordinal, interval and ratio scales
alias:
  - escalas de medición
  - niveles de medición
  - escalas de Stevens
modulo: 4
submodulo: '4.1'
orden: 5
nivel: basico
prerrequisitos:
  - datos-cualitativos-y-cuantitativos
  - relaciones-y-relaciones-de-equivalencia
etiquetas:
  - escalas de medición
  - nominal
  - ordinal
  - intervalo
  - razón
  - transformaciones admisibles
resumen: >
  Las cuatro escalas de medición ordenan a las variables según las comparaciones que admiten: igualdad,
  orden, diferencias y cocientes. Cada escala conserva las operaciones de las anteriores.
formula: '\text{nominal: } g \text{ biyectiva};\ \text{ordinal: } g \text{ creciente};\ \text{intervalo: } a + bx;\ \text{razón: } bx'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: escalas
    variable: temperatura
referencias:
  - clave: agresti
    capitulo: '1'
  - clave: degroot
publicado: true
---

## Intuición

Un día a 20 °C no es "el doble de caluroso" que uno a 10 °C, aunque 20 sea el doble de 10. Basta cambiar a grados Fahrenheit para comprobarlo: los mismos días marcan 68 y 50 °F, y 68 no es el doble de 50. En cambio, una maleta de 40 kg sí pesa el doble que una de 20 kg, y en libras sigue pesando el doble.

La diferencia está en el cero. El cero de la escala Celsius es una convención (el punto de congelación del agua), mientras que 0 kg significa ausencia total de peso. Las **escalas de medición** clasifican a las variables según qué afirmaciones sobre sus valores siguen siendo verdaderas cuando se cambia arbitrariamente la forma de registrarlas: la unidad, el origen o los códigos. Lo que sobrevive a esos cambios es información real sobre las unidades observadas; lo que no sobrevive es un artefacto de la forma de registrar y no debe interpretarse.

## Definición

:::definicion[Escalas de medición]
Cada escala se caracteriza por las transformaciones $g$ que pueden aplicarse a los valores sin perder información, llamadas **transformaciones admisibles**, y por las comparaciones que esas transformaciones conservan:

- **Nominal:** cualquier $g$ biyectiva (renombrar categorías). Conserva solo la igualdad: $x = y$ o $x \neq y$.
- **Ordinal:** cualquier $g$ estrictamente creciente. Conserva además el orden: $x < y$.
- **De intervalo:** $g(x) = a + bx$ con $b > 0$. Conserva además las razones entre diferencias: $\dfrac{x_1 - x_2}{x_3 - x_4}$.
- **De razón:** $g(x) = bx$ con $b > 0$. Conserva además los cocientes $x/y$; tiene un cero absoluto.
:::

Las escalas nominal y ordinal corresponden a variables cualitativas; las de intervalo y de razón, a cuantitativas. Cada escala admite todas las operaciones de las anteriores.

| Escala | $=$, $\neq$ | $<$, $>$ | Diferencias | Cocientes | Ejemplo |
| --- | --- | --- | --- | --- | --- |
| Nominal | sí | no | no | no | tipo de sangre |
| Ordinal | sí | sí | no | no | nivel de dolor leve, moderado, intenso |
| De intervalo | sí | sí | sí | no | temperatura en °C, año calendario |
| De razón | sí | sí | sí | sí | peso, ingreso, tiempo de espera |

:::figura[Variables clasificadas en las cuatro escalas.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: escala
ejemplos:
  - nombre: Tipo de sangre
    valores: A, B, AB, O
    clase: nominal
    razon: Solo se puede decir si dos pacientes tienen o no el mismo tipo.
  - nombre: Nivel de dolor
    valores: leve, moderado, intenso
    clase: ordinal
    razon: Hay orden, pero la distancia entre leve y moderado no es comparable con la de moderado a intenso.
  - nombre: Año de nacimiento
    valores: 1987, 2003
    clase: intervalo
    razon: El año cero es una convención; 2000 no es el doble de 1000 en ningún sentido físico.
  - nombre: Tiempo de espera
    valores: 0, 12.5, 40 min
    clase: razon
    razon: Cero minutos es ausencia de espera; 40 minutos son el doble de 20.
  - nombre: Medalla
    valores: oro, plata, bronce
    clase: ordinal
    razon: Indica el orden de llegada, no las diferencias de tiempo.
  - nombre: Temperatura en kelvin
    valores: 273.15, 300 K
    clase: razon
    razon: 0 K es ausencia de energía térmica, un cero absoluto.
```
:::

:::nota[Qué significa cada símbolo]
- $x, y$: dos valores registrados de la variable.
- $g$: transformación que cambia la forma de registrar los valores (códigos, unidad u origen).
- $x \mapsto g(x)$: "el valor $x$ se sustituye por $g(x)$".
- $a$: desplazamiento del origen en una transformación de intervalo.
- $b$: cambio de unidad, un número positivo.
- $x_1, x_2, x_3, x_4$: cuatro valores cualesquiera; $\frac{x_1 - x_2}{x_3 - x_4}$ compara dos diferencias.
- $=, \neq, <, >$: igualdad, desigualdad y orden.
:::

## Cómo usar la visualización

En la parte superior se ubican dos observaciones, A y B, en la escala original. La reproducción aplica una transformación admisible para la escala de la variable (de Celsius a Fahrenheit en la temperatura) y dibuja cómo cada marca se traslada a la nueva escala. La tabla compara cuatro afirmaciones sobre A y B antes y después, y al final indica cuáles conservaron su sentido.

Con la temperatura, "A es menor que B" sobrevive, pero "B es el doble de A" se rompe. Al elegir el peso en el selector, incluso el cociente sobrevive. Con el color de ojos, un simple cambio de códigos invierte el orden entre A y B: el orden de los códigos nominales es arbitrario.

## Ejemplo

Una encuesta de satisfacción usa la escala 1 = muy baja, 2 = baja, 3 = media, 4 = alta, 5 = muy alta. Dos clientes responden A = 2 y B = 4.

1. Igualdad: A ≠ B. Tiene sentido: sus opiniones difieren.
2. Orden: A < B. Tiene sentido: B está más satisfecho.
3. Diferencia: B - A = 2. Con otros códigos igualmente válidos que respetan el orden, 1, 2, 4, 7, 10, los mismos clientes quedan en 2 y 7, y la diferencia pasa a 5. El valor de la diferencia depende de una elección arbitraria.
4. Cociente: B / A = 2 con los primeros códigos y 3.5 con los segundos. "B está el doble de satisfecho" no tiene sentido.

La escala es ordinal: la mediana de las respuestas es un resumen válido, porque solo usa el orden, mientras que la media de los códigos depende de la codificación elegida.

:::figura[El ejemplo de la encuesta: la recodificación creciente conserva el orden y cambia diferencias y cocientes.]{componente="DataTypesViz"}
```yaml
modo: escalas
variable: satisfaccion
```
:::

## Propiedades

- **Jerarquía.** Nominal, ordinal, intervalo y razón forman una jerarquía: una variable de razón puede tratarse como de intervalo, ordinal o nominal, perdiendo información en cada paso, pero no al revés.
- **Resúmenes permitidos.** La moda sirve en todas las escalas; la mediana y los cuantiles desde la ordinal; la media y la desviación estándar desde la de intervalo; el coeficiente de variación y la media geométrica solo en la de razón.
- **Cero absoluto.** Una escala de razón tiene un cero que significa ausencia de la magnitud; por eso los cocientes no dependen de la unidad.
- **Intervalo y diferencias.** En una escala de intervalo, las diferencias sí son de razón: una diferencia de 20 °C es el doble de una de 10 °C, y lo sigue siendo en Fahrenheit (36 y 18 °F).

:::figura[Propiedad de la escala de razón: al pasar de kilogramos a libras, todas las afirmaciones, incluido el cociente, conservan su sentido.]{componente="DataTypesViz"}
```yaml
modo: escalas
variable: peso
```
:::

:::figura[Propiedad de la escala nominal: un cambio de códigos conserva la igualdad pero invierte el orden de A y B.]{componente="DataTypesViz"}
```yaml
modo: escalas
variable: colores
```
:::

## Errores comunes

- **Calcular cocientes en escalas de intervalo.** "Hoy hace el doble de calor que ayer" o "el costo subió 30 % respecto al año 1990" aplicado al año calendario son afirmaciones sin sentido.
- **Promediar respuestas ordinales sin advertencia.** La media de una escala de 1 a 5 supone que los saltos entre categorías son iguales. Es una práctica común, pero debe reconocerse como un supuesto adicional y contrastarse con la mediana.
- **Confundir intervalo y razón por la presencia de un cero.** Que un valor cero sea posible no basta; debe significar ausencia de la magnitud. Una calificación de 0 en un examen no significa ausencia de conocimiento, y 8 no es el doble de 4 en conocimiento.

:::figura[Casos que suelen clasificarse mal por la presencia de números o de un cero.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: escala
ejemplos:
  - nombre: Calificación de examen
    valores: 0, 4, 8, 10
    clase: intervalo
    razon: El 0 no es ausencia de conocimiento; se tratan las diferencias como comparables, no los cocientes.
  - nombre: Lugar en la carrera
    valores: 1, 2, 3
    clase: ordinal
    razon: El segundo lugar no llegó el doble de tarde que el primero.
  - nombre: Número de cuenta bancaria
    valores: 0012 4471
    clase: nominal
    razon: Es un identificador.
  - nombre: Temperatura en °F
    valores: 32, 68, 98.6
    clase: intervalo
    razon: El cero Fahrenheit es convencional.
  - nombre: Distancia al hospital
    valores: 0, 2.4, 11 km
    clase: razon
    razon: Cero kilómetros es no tener que desplazarse; 11 km es más del cuádruple de 2.4 km.
```
:::

## Conexiones

Las escalas refinan la división entre [[datos-cualitativos-y-cuantitativos]]: nominal y ordinal para las primeras, intervalo y razón para las segundas. La escala nominal se apoya en una [[relaciones-y-relaciones-de-equivalencia|relación de equivalencia]] (tener la misma categoría) y la ordinal en una relación de orden. La escala determina qué medidas de tendencia central son válidas: la moda siempre, la mediana desde la ordinal, la media aritmética desde la de intervalo y la media geométrica solo en la de razón. Independientemente de la escala, una variable cuantitativa puede ser [[datos-discretos-y-continuos|discreta o continua]].

## Formulario

:::formula[Transformación admisible nominal]
$$
x \mapsto g(x), \quad g \text{ biyectiva}
$$

- $g$: renombramiento uno a uno de las categorías.
:::

:::formula[Transformación admisible ordinal]
$$
x \mapsto g(x), \quad x < y \Rightarrow g(x) < g(y)
$$

- $g$: función estrictamente creciente.
- $x, y$: dos valores de la variable.
:::

:::formula[Transformación admisible de intervalo]
$$
x \mapsto a + b\,x, \quad b > 0, \qquad \frac{x_1 - x_2}{x_3 - x_4} \text{ se conserva}
$$

- $a$: cambio de origen.
- $b$: cambio de unidad.
- $x_1, \dots, x_4$: valores cualesquiera.
:::

:::formula[Transformación admisible de razón]
$$
x \mapsto b\,x, \quad b > 0, \qquad \frac{x}{y} \text{ se conserva}
$$

- $b$: cambio de unidad.
- $x/y$: cociente entre dos valores.
:::

:::formula[Cambio de Celsius a Fahrenheit]
$$
F = 1.8\,C + 32
$$

- $C$: temperatura en grados Celsius.
- $F$: temperatura en grados Fahrenheit.
- $1.8$: cambio de unidad; $32$: cambio de origen.
:::
