---
id: media-winsorizada
titulo: Media winsorizada
titulo_en: Winsorized mean
alias:
  - winsorización
  - winsorized mean
modulo: 4
submodulo: '4.2'
orden: 7
nivel: basico
prerrequisitos:
  - media-recortada
etiquetas:
  - tendencia central
  - estadística robusta
  - valores atípicos
  - winsorización
resumen: >
  La media winsorizada sustituye los valores más extremos de cada lado por el valor más cercano que
  se conserva y luego promedia todos; mantiene el número de datos pero limita la influencia de los extremos.
formula: '\bar{x}_{W} = \frac{1}{n}\Big(g\,x_{(g+1)} + \sum_{i=g+1}^{n-g} x_{(i)} + g\,x_{(n-g)}\Big)'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [21.4, 21.9, 22.1, 22.0, 21.7, 35.0, 21.8, 22.3, 21.6, 22.0]
    medidas: [winsorizada, recortada, media]
    proporcion: 0.1
    variable: Temperatura registrada por un sensor
    unidad: °C
    decimales: 1
referencias:
  - clave: wasserman
publicado: true
---

## Intuición

Un sensor de temperatura en un invernadero envía diez lecturas, y una de ellas marca 35 °C por un rayo de sol directo sobre el aparato. No conviene creerle a esa lectura, pero tampoco desecharla por completo: sí indica que en ese momento la temperatura era de las más altas del periodo. Una salida razonable es "recortarle el exceso": tratarla como si fuera igual a la siguiente lectura más alta y conservarla.

La **media winsorizada** hace exactamente eso. En lugar de quitar los valores extremos, como la media recortada, los jala hacia adentro hasta el valor más cercano que no se considera extremo, y después promedia todos los datos. El número de observaciones no cambia; lo que cambia es que ningún valor puede pesar más que los que están en el borde del grueso de los datos. El nombre viene del bioestadístico Charles Winsor, que propuso la técnica.

## Definición

:::definicion[Media winsorizada]
Sean $x_{(1)} \le \dots \le x_{(n)}$ los datos ordenados, $\alpha \in [0, 0.5)$ y $g = \lfloor n\alpha \rfloor$. Los datos **winsorizados** son
$$
w_i = \begin{cases} x_{(g+1)} & \text{si } x_i < x_{(g+1)},\\ x_{(n-g)} & \text{si } x_i > x_{(n-g)},\\ x_i & \text{en otro caso,} \end{cases}
$$
y la **media winsorizada** es su media aritmética: $\bar{x}_{W} = \frac{1}{n}\sum_{i=1}^{n} w_i$.
:::

Equivalentemente, se cuentan $g$ veces el valor $x_{(g+1)}$, se suman los valores centrales y se cuentan $g$ veces el valor $x_{(n-g)}$, y todo se divide entre $n$.

:::figura[Winsorización al 30 % de los tiempos de llegada de 10 trabajadores, en minutos después de las 7. Los tres valores más bajos se suben a 52 y los tres más altos se bajan a 58; las líneas punteadas muestran a dónde se mueve cada uno.]{componente="DataStrip"}
```yaml
modo: centro
datos: [52, 48, 61, 55, 58, 49, 60, 57, 3, 140]
medidas: [winsorizada, media]
proporcion: 0.3
variable: Minutos después de las 7
unidad: min
decimales: 0
```
:::

:::nota[Qué significa cada símbolo]
- $x_{(i)}$: $i$-ésimo valor al ordenar los datos.
- $n$: número de datos.
- $\alpha$: proporción winsorizada en cada extremo.
- $g = \lfloor n\alpha \rfloor$: número de valores sustituidos de cada lado.
- $x_{(g+1)}$: valor más pequeño que se conserva; sustituye a los $g$ menores.
- $x_{(n-g)}$: valor más grande que se conserva; sustituye a los $g$ mayores.
- $w_i$: dato $i$ después de winsorizar.
- $\bar{x}_W$: media winsorizada.
:::

## Cómo usar la visualización

Cada círculo es una lectura del sensor. Los valores que la winsorización sustituye se conectan con una línea punteada a su nueva posición, marcada bajo el eje. El encabezado muestra la suma de los diez valores ya winsorizados. Se comparan tres marcadores: la media winsorizada, la recortada y la aritmética.

Con proporción 0.1, la lectura de 35 °C pasa a valer 22.3 °C y la mínima de 21.4 °C pasa a 21.6 °C; la media winsorizada y la recortada quedan casi iguales, cerca de 21.93, mientras que la media aritmética sube a 23.18. Al arrastrar la lectura anómala hasta el extremo, la media aritmética la sigue y la winsorizada no se mueve.

## Ejemplo

Las diez lecturas del sensor son 21.4, 21.9, 22.1, 22.0, 21.7, 35.0, 21.8, 22.3, 21.6 y 22.0 °C. Se winsoriza al 10 %.

1. $g = \lfloor 10 \cdot 0.1 \rfloor = 1$. Ordenadas: 21.4, 21.6, 21.7, 21.8, 21.9, 22.0, 22.0, 22.1, 22.3, 35.0.
2. El menor, 21.4, se sustituye por $x_{(2)} = 21.6$; el mayor, 35.0, por $x_{(9)} = 22.3$.
3. Suma de los datos winsorizados: $219.3$.
4. Media winsorizada: $219.3 / 10 = 21.93$ °C.
5. Comparación: la media aritmética es 23.18 °C y la recortada al 10 %, $175.4/8 = 21.925$ °C.

:::figura[Las lecturas del ejemplo con el panel de valores: la media winsorizada es 21.93 °C y la aritmética 23.18 °C. La lectura de 35 °C se marca bajo el eje en su nuevo valor, 22.3 °C.]{componente="DataStrip"}
```yaml
modo: centro
datos: [21.4, 21.9, 22.1, 22.0, 21.7, 35.0, 21.8, 22.3, 21.6, 22.0]
medidas: [winsorizada, media]
proporcion: 0.1
variable: Lectura del sensor
unidad: °C
decimales: 1
dominio: [21, 36]
```
:::

## Propiedades

- **Conserva el tamaño de muestra:** se promedian $n$ valores, a diferencia de la media recortada, que promedia $n - 2g$.
- **Resistencia:** como la recortada, tolera aproximadamente una fracción $\alpha$ de valores arbitrariamente extremos en cada lado.
- **Cerca de la recortada:** en datos sin atípicos y simétricos, ambas dan resultados muy parecidos; la winsorizada da algo más de peso a los bordes.
- **Base de la varianza winsorizada:** la varianza de los datos winsorizados es una medida de dispersión robusta y se usa en pruebas para medias recortadas.

:::figura[Propiedad de resistencia: ingresos mensuales de diez hogares, en miles de pesos. Con un hogar de 95 mil, la media aritmética es 19.9, mientras que la winsorizada y la recortada al 10 % valen 12.]{componente="DataStrip"}
```yaml
modo: centro
datos: [8, 9, 10, 11, 12, 12, 13, 14, 15, 95]
medidas: [winsorizada, recortada, media]
proporcion: 0.1
variable: Ingreso mensual
unidad: miles de pesos
decimales: 0
```
:::

## Errores comunes

- **Winsorizar sin decirlo.** Los datos winsorizados ya no son las mediciones originales; cualquier resumen calculado con ellos debe reportarlo.
- **Creer que winsorizar corrige el dato.** El valor sustituido no es una estimación del verdadero, es un límite. Si la lectura de 35 °C era real, la winsorización la subestima.
- **Confundirla con la media recortada.** Con los mismos datos y la misma $\alpha$, la recortada divide entre $n - 2g$ y la winsorizada entre $n$; los resultados son parecidos pero no iguales.

:::figura[La diferencia entre ambas medias se nota con un recorte grande: con 30 % en los tiempos de llegada, la recortada promedia los 4 valores centrales y la winsorizada los 10 valores ya sustituidos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [52, 48, 61, 55, 58, 49, 60, 57, 3, 140]
medidas: [recortada, winsorizada]
proporcion: 0.3
variable: Minutos después de las 7
unidad: min
decimales: 0
```
:::

## Conexiones

La media winsorizada es la variante de la [[media-recortada]] que conserva todas las observaciones. Ambas están entre la [[media-aritmetica]] y la [[mediana]] en cuanto a resistencia. La winsorización es una transformación de datos usada también antes de calcular correlaciones o ajustar modelos, cuando se quiere limitar la influencia de valores extremos sin eliminarlos.

## Formulario

:::formula[Dato winsorizado]
$$
w_i = \min\big(\max(x_i,\ x_{(g+1)}),\ x_{(n-g)}\big)
$$

- $x_i$: dato original.
- $x_{(g+1)}$, $x_{(n-g)}$: límites inferior y superior.
- $w_i$: dato winsorizado.
:::

:::formula[Media winsorizada]
$$
\bar{x}_{W} = \frac{1}{n}\sum_{i=1}^{n} w_i = \frac{1}{n}\Big(g\,x_{(g+1)} + \sum_{i=g+1}^{n-g} x_{(i)} + g\,x_{(n-g)}\Big)
$$

- $n$: número de datos.
- $g = \lfloor n\alpha \rfloor$: valores sustituidos de cada lado.
:::
