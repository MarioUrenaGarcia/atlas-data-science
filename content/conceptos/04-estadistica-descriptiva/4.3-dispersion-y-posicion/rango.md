---
id: rango
titulo: Rango
titulo_en: Range
alias:
  - recorrido
  - amplitud
modulo: 4
submodulo: '4.3'
orden: 1
nivel: basico
prerrequisitos:
  - parametro-y-estadistico
relaciones:
  - tipo: relacionado
    id: rango-medio
etiquetas:
  - dispersión
  - mínimo y máximo
  - amplitud
  - extremos
resumen: >
  El rango es la diferencia entre el valor más grande y el más pequeño de los datos. Es la medida de
  dispersión más simple, pero solo usa dos observaciones y crece con el tamaño de la muestra.
formula: 'R = x_{(n)} - x_{(1)}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [5, 6, 6, 7, 7, 8, 15]
    medida: rango
    lecturas: [rango, desviacion, riq]
    variable: Espera en la ventanilla A
    unidad: min
    decimales: 0
    dominio: [3, 17]
    comparar:
      datos: [5, 8, 10, 11, 12, 13, 15]
      variable: Espera en la ventanilla B
      unidad: min
      dominio: [3, 17]
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Para empacar ropa de invierno y de verano en un viaje, lo primero que se consulta es la temperatura más baja y la más alta del pronóstico. La distancia entre ambas, el **rango**, dice qué tan distintos pueden ser los días: un rango de 3 °C permite llevar una sola chamarra; uno de 20 °C obliga a empacar de todo.

El rango es la manera más directa de medir cuánto varían los datos, pero tiene un costo: solo mira los dos extremos. Dos ventanillas de atención pueden tener exactamente el mismo rango de espera, de 5 a 15 minutos, aunque en una casi todos esperen 6 o 7 minutos y solo una persona haya esperado 15, y en la otra los tiempos estén repartidos por todo el intervalo. El rango no distingue esos casos, y una sola observación extrema basta para inflarlo.

## Definición

:::definicion[Rango]
Para datos $x_1, \dots, x_n$ con mínimo $x_{(1)}$ y máximo $x_{(n)}$, el **rango** es
$$
R = x_{(n)} - x_{(1)} = \max_i x_i - \min_i x_i.
$$
:::

Tiene las mismas unidades que los datos y requiere al menos una escala de intervalo. Siempre es mayor o igual a cero, y vale cero solo si todos los datos son iguales.

:::figura[Rango de los precios de un litro de leche en seis tiendas. La barra horizontal va del precio mínimo al máximo.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [24.5, 26.0, 25.2, 27.8, 25.5, 24.9]
medida: rango
lecturas: [rango]
variable: Precio de la leche
unidad: pesos
decimales: 1
dominio: [24, 28.5]
etiquetas: [Tienda 1, Tienda 2, Tienda 3, Tienda 4, Tienda 5, Tienda 6]
```
:::

:::nota[Qué significa cada símbolo]
- $R$: rango.
- $x_{(1)}$: valor más pequeño de los datos (primer dato ordenado).
- $x_{(n)}$: valor más grande (último dato ordenado).
- $n$: número de datos.
- $\max_i$, $\min_i$: máximo y mínimo sobre todas las observaciones.
:::

## Cómo usar la visualización

Hay dos grupos de tiempos de espera, uno por ventanilla, cada uno con una observación por fila. Al final de la animación aparece la barra del rango. Los dos grupos tienen el mismo rango, 10 minutos, pero el panel muestra que su desviación estándar y su rango intercuartílico son distintos.

Al arrastrar la espera de 15 minutos de la ventanilla A hasta 8 minutos, el rango de A cae de 10 a 3 aunque los otros seis datos no cambiaron. Al arrastrar cualquier dato intermedio, el rango no se mueve.

## Ejemplo

Las temperaturas máximas de una semana en Saltillo fueron 22, 25, 27, 24, 31, 26 y 23 °C.

1. Máximo: $x_{(7)} = 31$ °C. Mínimo: $x_{(1)} = 22$ °C.
2. Rango: $R = 31 - 22 = 9$ °C.
3. Si se excluye el día de 31 °C, el rango de los seis días restantes es $27 - 22 = 5$ °C: un solo día cálido explica casi la mitad del rango.

:::figura[Las temperaturas del ejemplo. El rango de 9 °C depende del día de 31 °C; al arrastrarlo hacia 27 °C, el rango baja a 5 °C.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [22, 25, 27, 24, 31, 26, 23]
medida: rango
lecturas: [rango, desviacion]
variable: Temperatura máxima
unidad: °C
decimales: 0
dominio: [20, 33]
etiquetas: [Lun, Mar, Mié, Jue, Vie, Sáb, Dom]
```
:::

## Propiedades

- **Equivarianza:** si $y_i = a + b x_i$, el rango de las $y$ es $|b|\,R$. Sumar una constante no cambia el rango.
- **Crece con $n$:** al agregar observaciones el rango solo puede aumentar o mantenerse, por eso no sirve para comparar muestras de tamaños distintos.
- **Punto de ruptura cero:** un solo valor extremo puede hacer el rango tan grande como se quiera.
- **Cota de la desviación estándar:** para cualquier conjunto de datos, la desviación estándar (con denominador $n$) no supera $R/2$.

:::figura[Propiedad de sensibilidad: diez mediciones del diámetro de una pieza con un error de captura de 19.8 mm en lugar de 9.8 mm. El rango pasa de unas décimas a más de 10 mm.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [10.1, 9.9, 10.0, 10.2, 9.8, 10.1, 10.0, 9.9, 10.2, 19.8]
medida: rango
lecturas: [rango, riq]
variable: Diámetro de la pieza
unidad: mm
decimales: 1
```
:::

## Errores comunes

- **Comparar rangos de muestras de distinto tamaño.** Una muestra de 100 personas casi siempre tendrá mayor rango de estaturas que una de 10 de la misma población.
- **Interpretar el rango como "dónde están los datos".** El rango dice entre qué valores están todos los datos, no cómo se reparten.
- **Confundir el rango con el rango intercuartílico o con el rango medio.** El rango usa los extremos; el intercuartílico, los cuartiles; el rango medio es un punto, no una distancia.

:::figura[El mismo rango con formas muy distintas: tiempos de traslado de dos grupos de seis estudiantes. Ambos van de 10 a 40 minutos, pero en el primero casi todos tardan cerca de 10 y en el segundo los tiempos están repartidos.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [10, 11, 11, 12, 13, 40]
medida: rango
lecturas: [rango, desviacion]
variable: Traslado, grupo 1
unidad: min
decimales: 0
dominio: [5, 45]
comparar:
  datos: [10, 16, 22, 28, 34, 40]
  variable: Traslado, grupo 2
  unidad: min
  dominio: [5, 45]
```
:::

## Conexiones

El rango usa los mismos dos estadísticos de orden que el [[rango-medio]], que es su punto central. Las medidas de dispersión que usan todos los datos, como la [[varianza-muestral]] y la [[desviacion-estandar-muestral]], o que resisten extremos, como el [[rango-intercuartilico]], corrigen sus limitaciones. Junto con los cuartiles forma parte del [[resumen-de-cinco-numeros]].

## Formulario

:::formula[Rango]
$$
R = x_{(n)} - x_{(1)}
$$

- $x_{(n)}$: valor máximo.
- $x_{(1)}$: valor mínimo.
:::

:::formula[Transformación lineal]
$$
y_i = a + b\,x_i \ \Longrightarrow\ R_y = |b|\,R_x
$$

- $a$: desplazamiento; no cambia el rango.
- $b$: cambio de escala.
- $R_x, R_y$: rangos de los datos originales y transformados.
:::

:::formula[Cota de la desviación estándar]
$$
\sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2} \le \frac{R}{2}
$$

- $\bar{x}$: media de los datos.
- $n$: número de datos.
:::
