---
id: datos-cualitativos-y-cuantitativos
titulo: Datos cualitativos y cuantitativos
titulo_en: Qualitative and quantitative data
alias:
  - variables categóricas
  - variables numéricas
  - datos categóricos
modulo: 4
submodulo: '4.1'
orden: 3
nivel: basico
prerrequisitos:
  - poblacion-y-muestra
etiquetas:
  - tipos de variable
  - variable categórica
  - variable numérica
  - clasificación de datos
resumen: >
  Una variable cualitativa registra a qué categoría pertenece cada unidad; una cuantitativa registra
  una cantidad con la que tiene sentido hacer aritmética.
formula: 'x_i \in \{c_1, \dots, c_K\} \quad\text{frente a}\quad x_i \in \mathbb{R}'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: clasificar
    eje: naturaleza
    ejemplos:
      - nombre: Turno de trabajo
        valores: matutino, vespertino, nocturno
        clase: cualitativo
        razon: Cada valor nombra un grupo; no se puede sumar ni promediar un turno.
      - nombre: Piezas producidas por hora
        valores: 118, 124, 97
        clase: cuantitativo
        razon: Es un conteo; tiene sentido decir que una hora produjo 27 piezas más que otra.
      - nombre: Material de la carcasa
        valores: aluminio, acero, plástico
        clase: cualitativo
        razon: Solo distingue tipos de material.
      - nombre: Temperatura del horno
        valores: 212.4, 208.9, 215.0
        clase: cuantitativo
        razon: Es una medición en grados; las diferencias entre lecturas son cantidades.
      - nombre: Número de lote
        valores: L-1043, L-1044
        clase: cualitativo
        razon: Aunque lleva cifras, es una etiqueta; promediar números de lote no significa nada.
      - nombre: Resultado de la inspección
        valores: aprobada, rechazada
        clase: cualitativo
        razon: Dos categorías; se resume con la proporción de aprobadas, no con una media.
      - nombre: Grosor de la lámina
        valores: 1.21 mm, 1.19 mm
        clase: cuantitativo
        razon: Es una longitud medida.
      - nombre: Tiempo de ciclo
        valores: 42 s, 39 s, 45 s
        clase: cuantitativo
        razon: Es una duración; su promedio es el tiempo típico por pieza.
referencias:
  - clave: agresti
    capitulo: '1'
  - clave: degroot
publicado: true
---

## Intuición

Un formulario de admisión en un hospital pide el tipo de sangre, la edad, el número de hijos, si la persona fuma y su temperatura. Algunas respuestas son **etiquetas**: dicen a qué grupo pertenece la persona (tipo A, fumadora). Otras son **cantidades**: dicen cuánto de algo tiene (38.2 grados, 3 hijos).

La diferencia no es cosmética. Con cantidades tiene sentido sumar, restar y promediar: la temperatura media de los pacientes es un número útil. Con etiquetas no: no existe un "tipo de sangre promedio", y si el tipo A se codifica como 1 y el B como 2, promediar esos códigos da un número sin significado. Por eso, antes de calcular cualquier resumen o elegir cualquier gráfico, lo primero es preguntar de cada variable si registra una categoría o una cantidad. La respuesta no siempre está en la forma del dato: un código postal está escrito con cifras y aun así es una etiqueta.

## Definición

:::definicion[Variable cualitativa y cuantitativa]
Una variable es **cualitativa** (o categórica) si su valor en cada unidad es una categoría de un conjunto $\{c_1, \dots, c_K\}$, y las operaciones aritméticas entre valores no tienen significado.

Una variable es **cuantitativa** (o numérica) si su valor en cada unidad es un número real $x_i \in \mathbb{R}$ que expresa una cantidad, de modo que las diferencias entre valores tienen significado en las unidades de medida de la variable.
:::

Las variables cualitativas se resumen con frecuencias y proporciones por categoría; las cuantitativas, además, con medias, varianzas y cuantiles. Las cualitativas se dividen a su vez en nominales y ordinales, y las cuantitativas en discretas y continuas, según se estudia en [[escalas-nominal-ordinal-de-intervalo-y-de-razon]] y en [[datos-discretos-y-continuos]].

:::figura[Clasificación de las variables de un registro escolar. Al seleccionar una tarjeta aparece la razón de su clasificación.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: naturaleza
ejemplos:
  - nombre: Carrera
    valores: Biología, Economía, Derecho
    clase: cualitativo
    razon: Nombra un grupo de estudiantes.
  - nombre: Promedio de calificaciones
    valores: 8.7, 9.2, 7.5
    clase: cuantitativo
    razon: Es una cantidad; la diferencia de 0.5 puntos significa lo mismo en cualquier parte de la escala.
  - nombre: Beca
    valores: sí, no
    clase: cualitativo
    razon: Dos categorías.
  - nombre: Materias reprobadas
    valores: 0, 1, 3
    clase: cuantitativo
    razon: Es un conteo de materias.
  - nombre: Matrícula
    valores: 2024-0381
    clase: cualitativo
    razon: Identifica a cada estudiante; no mide nada.
  - nombre: Minutos de traslado a la escuela
    valores: 35, 50, 12
    clase: cuantitativo
    razon: Es una duración.
```
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valor de la variable en la unidad $i$.
- $c_1, \dots, c_K$: categorías posibles de una variable cualitativa.
- $K$: número de categorías.
- $\in$: "pertenece a".
- $\mathbb{R}$: conjunto de los números reales.
:::

## Cómo usar la visualización

Las tarjetas son variables de una línea de producción, cada una con algunos valores de muestra. La reproducción las lleva una por una a la caja de su tipo y el texto superior explica la razón. También es posible seleccionar cualquier tarjeta para ver su clasificación sin esperar.

Conviene fijarse en el número de lote: aunque está escrito con cifras, termina en la caja cualitativa. El resultado de la inspección tiene solo dos valores y también es cualitativo. En el panel lateral se lleva la cuenta de cuántas variables hay de cada tipo, que es lo primero que conviene saber de una tabla de datos nueva.

## Ejemplo

Un expediente clínico registra seis variables de cada paciente. Se clasifican preguntando si tiene sentido restar dos valores.

1. **Tipo de sangre** (A, B, AB, O): restar "AB menos O" no significa nada. Cualitativa.
2. **Edad en años** (34, 51, 67): $67 - 34 = 33$ años de diferencia. Cuantitativa.
3. **Número de consultas en el año** (2, 5, 0): la diferencia es un número de consultas. Cuantitativa.
4. **Presión sistólica** (118, 142 mmHg): la diferencia de 24 mmHg es una cantidad. Cuantitativa.
5. **Código postal** (72000, 72590): la resta da 590, que no mide nada. Cualitativa.
6. **Fumador** (sí, no): cualitativa con dos categorías.

El expediente tiene tres variables cualitativas y tres cuantitativas. Para las primeras se reportarán porcentajes, como "38 % tipo O"; para las segundas, medias y dispersión, como "edad media de 52 años".

:::figura[Las seis variables del expediente clínico del ejemplo, clasificadas una por una.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: naturaleza
ejemplos:
  - nombre: Tipo de sangre
    valores: A, B, AB, O
    clase: cualitativo
    razon: Restar dos tipos de sangre no significa nada.
  - nombre: Edad
    valores: 34, 51, 67 años
    clase: cuantitativo
    razon: 67 - 34 = 33 años de diferencia.
  - nombre: Consultas en el año
    valores: 2, 5, 0
    clase: cuantitativo
    razon: La diferencia es un número de consultas.
  - nombre: Presión sistólica
    valores: 118, 142 mmHg
    clase: cuantitativo
    razon: La diferencia de 24 mmHg es una cantidad.
  - nombre: Código postal
    valores: 72000, 72590
    clase: cualitativo
    razon: La resta da 590, que no mide nada.
  - nombre: Fumador
    valores: sí, no
    clase: cualitativo
    razon: Dos categorías.
```
:::

## Propiedades

- **La prueba de la resta.** Una variable es cuantitativa si la diferencia entre dos valores tiene un significado expresable en unidades de la variable.
- **De cuantitativa a cualitativa sí, al revés no.** Una edad en años se puede agrupar en categorías (joven, adulto, mayor), pero al hacerlo se pierde información; a partir de las categorías ya no se recupera la edad exacta.
- **Los resúmenes dependen del tipo.** La moda y las proporciones sirven para ambos tipos; la media y la desviación estándar solo para cuantitativas.
- **Codificar no cambia el tipo.** Asignar números a categorías (1 para sí, 0 para no) facilita el cálculo, pero la variable sigue siendo cualitativa. En el caso binario, la media de los códigos 0 y 1 coincide con la proporción de unos, que sí tiene significado.

:::figura[Propiedad: cada variable cuantitativa tiene una versión agrupada en categorías, que es cualitativa y contiene menos información.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: naturaleza
ejemplos:
  - nombre: Edad en años
    valores: 17, 34, 71
    clase: cuantitativo
    razon: Cantidad de años vividos.
  - nombre: Grupo de edad
    valores: joven, adulto, mayor
    clase: cualitativo
    razon: Agrupa las edades en tres categorías; ya no distingue 34 de 50 años.
  - nombre: Ingreso mensual
    valores: 9800, 23500 pesos
    clase: cuantitativo
    razon: Cantidad de dinero.
  - nombre: Nivel de ingreso
    valores: bajo, medio, alto
    clase: cualitativo
    razon: Resume el ingreso en tres grupos.
  - nombre: Lluvia diaria
    valores: 0, 3.4, 27.1 mm
    clase: cuantitativo
    razon: Altura de agua acumulada.
  - nombre: Día lluvioso
    valores: sí, no
    clase: cualitativo
    razon: Solo indica si llovió más de 1 mm.
```
:::

## Errores comunes

- **Clasificar por la apariencia del dato.** Códigos postales, números de camiseta, números telefónicos y claves de producto están escritos con cifras, pero son etiquetas. El error lleva a reportar cosas como "el código postal promedio es 54,321".
- **Promediar códigos de categorías.** Si en una encuesta 1 = soltero, 2 = casado y 3 = divorciado, la media 1.8 no describe a nadie.
- **Suponer que pocas categorías numéricas vuelven cualitativa una variable.** El número de hijos toma pocos valores, pero es un conteo: tiene sentido decir que el promedio es 1.7 hijos por hogar.

:::figura[Casos engañosos: variables escritas con números que son cualitativas, y una variable con pocos valores que sí es cuantitativa.]{componente="DataTypesViz"}
```yaml
modo: clasificar
eje: naturaleza
ejemplos:
  - nombre: Número de camiseta
    valores: 7, 10, 23
    clase: cualitativo
    razon: Identifica al jugador; el 23 no es tres veces mejor que el 7.
  - nombre: Teléfono
    valores: 222 481 0395
    clase: cualitativo
    razon: Es un identificador.
  - nombre: Estado civil codificado
    valores: 1, 2, 3
    clase: cualitativo
    razon: Los códigos 1, 2 y 3 nombran categorías; su media no describe a nadie.
  - nombre: Hijos por hogar
    valores: 0, 1, 2, 3
    clase: cuantitativo
    razon: Aunque toma pocos valores, es un conteo y su promedio tiene sentido.
  - nombre: Goles en el partido
    valores: 0, 2, 5
    clase: cuantitativo
    razon: Es un conteo de goles.
```
:::

## Conexiones

Clasificar las variables es el primer paso después de definir la [[poblacion-y-muestra|población y la muestra]]. La división se refina en [[datos-discretos-y-continuos]] para las cuantitativas y en las [[escalas-nominal-ordinal-de-intervalo-y-de-razon|escalas de medición]] para ambas. Las variables cualitativas se analizan con [[tablas-de-contingencia]] y [[grafico-de-barras|gráficos de barras]]; las cuantitativas con la [[media-aritmetica]], la [[mediana]] y el [[histograma]]. El [[parametro-y-estadistico|parámetro]] natural de una variable cualitativa es una proporción.

## Formulario

:::formula[Variable cualitativa]
$$
x_i \in \{c_1, c_2, \dots, c_K\}
$$

- $x_i$: valor de la unidad $i$.
- $c_k$: categoría $k$ de las $K$ posibles.
:::

:::formula[Variable cuantitativa]
$$
x_i \in \mathbb{R}, \qquad x_i - x_j \ \text{tiene unidades de la variable}
$$

- $x_i, x_j$: valores de las unidades $i$ y $j$.
- $\mathbb{R}$: números reales.
:::

:::formula[Proporción de una categoría]
$$
\hat{p}_k = \frac{n_k}{n}
$$

- $\hat{p}_k$: proporción de unidades en la categoría $c_k$.
- $n_k$: número de unidades de la muestra en esa categoría.
- $n$: tamaño de la muestra.
:::
