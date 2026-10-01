---
id: media-ponderada
titulo: Media ponderada
titulo_en: Weighted mean
alias:
  - promedio ponderado
  - weighted average
modulo: 4
submodulo: '4.2'
orden: 2
nivel: basico
prerrequisitos:
  - media-aritmetica
etiquetas:
  - tendencia central
  - pesos
  - promedio ponderado
  - promedio de promedios
resumen: >
  La media ponderada asigna a cada valor un peso no negativo y divide la suma de productos entre la
  suma de pesos; los valores con más peso influyen más en el resultado.
formula: '\bar{x}_w = \frac{\sum_{i=1}^{n} w_i x_i}{\sum_{i=1}^{n} w_i}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [9.2, 7.5, 8.8, 6.9]
    pesos: [8, 6, 4, 2]
    medidas: [ponderada, media]
    balanza: true
    variable: Calificación
    etiquetas: [Cálculo, Física, Química, Taller]
    dominio: [6, 10]
referencias:
  - clave: degroot
  - clave: lohr
    capitulo: '3'
publicado: true
---

## Intuición

En una universidad, una materia de 8 créditos pesa más en el promedio que un taller de 2 créditos, porque ocupa más horas del semestre. Si se sacara la media aritmética de las calificaciones, el taller contaría igual que la materia larga, lo cual no refleja el esfuerzo de cada una.

La **media ponderada** resuelve eso dando a cada valor un peso. En la balanza de la media aritmética todas las monedas eran iguales; aquí cada dato es una moneda de distinto tamaño, y el punto de equilibrio se acerca a las monedas más pesadas. El peso puede ser cualquier medida de importancia o de tamaño: créditos, litros comprados, número de personas en un grupo, días en un periodo. Cuando todos los pesos son iguales, la balanza vuelve a ser la de siempre y la media ponderada coincide con la aritmética.

## Definición

:::definicion[Media ponderada]
Dados valores $x_1, \dots, x_n$ y pesos $w_1, \dots, w_n \ge 0$ con $\sum w_i > 0$, la **media ponderada** es
$$
\bar{x}_w = \frac{\sum_{i=1}^{n} w_i x_i}{\sum_{i=1}^{n} w_i}.
$$
Con pesos normalizados $p_i = w_i / \sum_j w_j$, que suman 1, se escribe $\bar{x}_w = \sum_{i=1}^{n} p_i x_i$.
:::

Multiplicar todos los pesos por la misma constante positiva no cambia el resultado; solo importan las proporciones entre ellos.

:::figura[Precio medio por kilo de una mezcla de café: 5 kg de un café de 180 pesos por kilo, 3 kg de uno de 240 y 2 kg de uno de 320. El tamaño de cada círculo es su peso en kilos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [180, 240, 320]
pesos: [5, 3, 2]
medidas: [ponderada, media]
balanza: true
variable: Precio por kilo
unidad: pesos
decimales: 0
dominio: [160, 340]
etiquetas: [Café A, Café B, Café C]
```
:::

:::nota[Qué significa cada símbolo]
- $\bar{x}_w$: media ponderada.
- $x_i$: valor $i$.
- $w_i$: peso del valor $i$, un número no negativo.
- $n$: número de valores.
- $\sum_{i=1}^{n} w_i x_i$: suma de cada valor multiplicado por su peso.
- $\sum_{i=1}^{n} w_i$: suma de los pesos.
- $p_i$: peso normalizado, la fracción del peso total que corresponde al valor $i$.
:::

## Cómo usar la visualización

Cada círculo es una materia y su tamaño indica los créditos; la etiqueta superior muestra el nombre. El encabezado calcula la media ponderada con los productos de créditos por calificación. Hay dos marcadores: la media ponderada y la media aritmética simple. Con la balanza activada, el triángulo de apoyo está en la media ponderada y las sumas ponderadas de distancias a cada lado coinciden.

Al arrastrar Cálculo, la materia de 8 créditos, el promedio ponderado se mueve mucho; al arrastrar el Taller, de 2 créditos, apenas cambia. Si las cuatro calificaciones se colocan en el mismo valor, las dos medias coinciden con él, sin importar los pesos.

## Ejemplo

Un repartidor carga gasolina tres veces en un mes: 40 litros a 23.50 pesos, 25 litros a 24.10 y 35 litros a 22.90. ¿Cuál fue el precio medio por litro?

1. Valores: los precios $x = (23.50, 24.10, 22.90)$. Pesos: los litros $w = (40, 25, 35)$.
2. Gasto total: $40 \cdot 23.50 + 25 \cdot 24.10 + 35 \cdot 22.90 = 940 + 602.50 + 801.50 = 2344$ pesos.
3. Litros totales: $40 + 25 + 35 = 100$.
4. Media ponderada: $\bar{x}_w = 2344 / 100 = 23.44$ pesos por litro.
5. La media simple de los tres precios es $23.50$; no responde la pregunta, porque trata igual a la carga de 25 litros que a la de 40.

:::figura[Las tres cargas de gasolina del ejemplo, con el tamaño de cada círculo proporcional a los litros. La media ponderada queda en 23.44, más cerca de la carga barata y grande de 35 litros.]{componente="DataStrip"}
```yaml
modo: centro
datos: [23.5, 24.1, 22.9]
pesos: [40, 25, 35]
medidas: [ponderada, media]
balanza: true
variable: Precio por litro
unidad: pesos
decimales: 2
dominio: [22.6, 24.4]
etiquetas: [Carga 1, Carga 2, Carga 3]
```
:::

## Propiedades

- **Pesos iguales:** si $w_1 = \dots = w_n$, entonces $\bar{x}_w = \bar{x}$.
- **Está entre el mínimo y el máximo:** $\min x_i \le \bar{x}_w \le \max x_i$, porque es un promedio con proporciones no negativas que suman 1.
- **Media de una tabla de frecuencias:** si el valor $v_k$ aparece $f_k$ veces, la media de todos los datos es la media ponderada de los $v_k$ con pesos $f_k$.
- **Promedio de promedios:** si $K$ grupos tienen tamaños $n_k$ y medias $\bar{x}_k$, la media del conjunto completo es $\sum n_k\bar{x}_k / \sum n_k$.
- **Un peso dominante:** cuando un peso es mucho mayor que los demás, la media ponderada se acerca a su valor.

:::figura[Propiedad del peso dominante: tres sucursales con ventas diarias medias de 12, 18 y 30 mil pesos, ponderadas por 27, 2 y 1 días de operación en el mes. La media ponderada queda en 13, mucho más cerca de 12 que la media simple de 20.]{componente="DataStrip"}
```yaml
modo: centro
datos: [12, 18, 30]
pesos: [27, 2, 1]
medidas: [ponderada, media]
variable: Venta diaria media
unidad: miles de pesos
decimales: 0
dominio: [8, 34]
etiquetas: [Centro, Norte, Sur]
```
:::

## Errores comunes

- **Promediar porcentajes de grupos de distinto tamaño.** Si en un grupo de 10 estudiantes aprueba el 90 % y en uno de 40 aprueba el 50 %, la tasa global no es 70 % sino $(10 \cdot 0.9 + 40 \cdot 0.5)/50 = 58$ %.
- **Usar como peso algo que no corresponde a la pregunta.** Para el precio medio por litro el peso son los litros; para el precio medio por visita a la gasolinera, cada carga pesa lo mismo. Las dos respuestas son válidas para preguntas distintas.
- **Olvidar dividir entre la suma de pesos.** Si los pesos no suman 1, $\sum w_i x_i$ no es un promedio.

:::figura[El error del promedio de porcentajes: dos grupos con 90 % y 50 % de aprobación, de 10 y 40 estudiantes. La media simple da 70 %, pero la proporción real del conjunto es 58 %.]{componente="DataStrip"}
```yaml
modo: centro
datos: [90, 50]
pesos: [10, 40]
medidas: [ponderada, media]
variable: Porcentaje de aprobación
unidad: '%'
decimales: 0
dominio: [40, 100]
etiquetas: [Grupo A, Grupo B]
```
:::

## Conexiones

La media ponderada generaliza la [[media-aritmetica]], que corresponde a pesos iguales. Es la forma de combinar [[parametro-y-estadistico|estadísticos]] de grupos distintos y la base de los estimadores de muestreo estratificado, donde cada estrato pesa según su tamaño en la población. En probabilidad, la esperanza de una variable discreta es una media ponderada de sus valores con pesos iguales a sus probabilidades. La [[media-geometrica]] y la [[media-armonica]] también admiten versiones ponderadas.

## Formulario

:::formula[Media ponderada]
$$
\bar{x}_w = \frac{\sum_{i=1}^{n} w_i x_i}{\sum_{i=1}^{n} w_i}
$$

- $x_i$: valor $i$.
- $w_i$: peso no negativo del valor $i$.
- $n$: número de valores.
:::

:::formula[Con pesos normalizados]
$$
\bar{x}_w = \sum_{i=1}^{n} p_i x_i, \qquad p_i = \frac{w_i}{\sum_{j=1}^{n} w_j}
$$

- $p_i$: proporción del peso total; los $p_i$ suman 1.
- $j$: índice que recorre todos los pesos.
:::

:::formula[Media combinada de grupos]
$$
\bar{x} = \frac{\sum_{k=1}^{K} n_k \bar{x}_k}{\sum_{k=1}^{K} n_k}
$$

- $K$: número de grupos.
- $n_k$: tamaño del grupo $k$.
- $\bar{x}_k$: media del grupo $k$.
:::
