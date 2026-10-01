---
id: multimodalidad
titulo: Multimodalidad
titulo_en: Multimodality
alias:
  - distribución bimodal
  - varias modas
  - mezcla de grupos
modulo: 4
submodulo: '4.4'
orden: 3
nivel: basico
prerrequisitos:
  - moda
  - asimetria-muestral
etiquetas:
  - forma de la distribución
  - bimodalidad
  - mezclas
  - densidad estimada
resumen: >
  Una distribución es multimodal si su histograma o su densidad tiene varios máximos locales. Suele
  indicar que los datos mezclan grupos distintos que conviene analizar por separado.
formula: 'f(x) = w\,f_1(x) + (1 - w)\,f_2(x)'
visualizacion:
  componente: DataStrip
  parametros:
    modo: forma
    enfoque: modas
    forma: mezcla
    parametro: 4
    centro: 170
    escala: 6
    variable: Estatura de estudiantes de un grupo mixto
    unidad: cm
referencias:
  - clave: degroot
  - clave: bishop
    capitulo: '9'
publicado: true
---

## Intuición

Si se miden las estaturas de todos los estudiantes de una preparatoria, el histograma puede mostrar dos jorobas: una alrededor de 158 cm y otra alrededor de 172 cm. No es que haya algo raro en los datos: el grupo mezcla mujeres y hombres, cuyas estaturas típicas son distintas. Cada joroba es la distribución de un subgrupo, y lo que se ve es su suma.

Una distribución con varias jorobas se llama **multimodal**; con dos, **bimodal**. Detectarla es importante porque cambia la lectura de todos los resúmenes: la media de un grupo bimodal puede caer en el valle, donde casi no hay datos, y la desviación estándar refleja sobre todo la distancia entre los grupos. La pregunta que sigue siempre es qué variable separa a los grupos. A veces es evidente, como el sexo o el turno; otras veces es un hallazgo del análisis.

## Definición

:::definicion[Multimodalidad]
Una distribución con densidad $f$ es **multimodal** si $f$ tiene más de un máximo local; cada máximo es una **moda**. En datos, la multimodalidad se observa como varios máximos locales en un histograma o en una densidad estimada.
:::

Un modelo natural es la **mezcla** de $K$ componentes, $f(x) = \sum_{k=1}^{K} w_k f_k(x)$, con pesos $w_k \ge 0$ que suman 1. Una mezcla no siempre es multimodal: para dos normales con la misma desviación estándar $\sigma$ y pesos iguales, la mezcla es bimodal solo si la distancia entre sus medias supera $2\sigma$.

:::figura[Una mezcla desigual: 30 % de clientes que compran en la mañana y 70 % en la tarde, con grupos separados por 4 desviaciones estándar. La densidad tiene dos máximos de alturas distintas.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: modas
forma: mezcla
parametro: 4
peso: 0.3
centro: 14
escala: 1.2
variable: Hora de compra
unidad: h
```
:::

:::nota[Qué significa cada símbolo]
- $f(x)$: densidad de la mezcla.
- $f_1, f_2$ o $f_k$: densidades de los componentes (subgrupos).
- $w$ o $w_k$: peso de cada componente, la proporción de datos que aporta.
- $K$: número de componentes.
- $\sigma$: desviación estándar de cada componente normal.
:::

## Cómo usar la visualización

La muestra de 400 estaturas crece por lotes. Sobre el histograma se dibujan la normal con la misma media y desviación estándar, que tiene un solo pico, y una densidad estimada, cuyos máximos locales se marcan con puntos. El encabezado lista los máximos encontrados.

Con una separación de 4 desviaciones estándar aparecen dos modas claras y la media cae en el valle. Al bajar la separación a 1.5, las jorobas se funden y queda una sola moda, aunque los datos sigan viniendo de dos grupos. El control del ancho de banda cambia la suavidad de la densidad: con 0.3 aparecen picos falsos por el ruido; con 3 desaparece incluso la bimodalidad real.

## Ejemplo

Una cafetería cuenta las llegadas por hora en un día: de 7 a 8, 2 clientes; de 8 a 9, 9; de 9 a 10, 5; de 10 a 11, 2; de 11 a 12, 3; de 12 a 13, 7; de 13 a 14, 10; de 14 a 15, 4.

1. Máximos locales: el intervalo de 8 a 9 (9 clientes, más que sus vecinos con 2 y 5) y el de 13 a 14 (10 clientes, más que 7 y 4).
2. La distribución es bimodal, con clases modales en la hora del desayuno y en la de la comida.
3. La hora media de llegada, calculada con los puntos medios de cada intervalo, es $\frac{2 \cdot 7.5 + 9 \cdot 8.5 + 5 \cdot 9.5 + 2 \cdot 10.5 + 3 \cdot 11.5 + 7 \cdot 12.5 + 10 \cdot 13.5 + 4 \cdot 14.5}{42} \approx 11.3$, una hora en la que casi no llega nadie.
4. Para planear turnos tiene más sentido describir los dos picos por separado.

:::figura[Llegadas simuladas con dos picos separados unas cinco horas, como en el ejemplo de la cafetería. La media queda en el valle del mediodía.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: modas
forma: mezcla
parametro: 5
peso: 0.45
centro: 11
escala: 1
variable: Hora de llegada
unidad: h
```
:::

## Propiedades

- **La media puede caer en un valle**, y la desviación estándar crece con la separación entre grupos más que con la variación dentro de ellos.
- **Separación mínima:** dos normales iguales de desviación $\sigma$ producen una mezcla bimodal solo si sus medias distan más de $2\sigma$.
- **Dependencia del suavizado:** el número de modas de un histograma o de una densidad estimada depende del ancho de los intervalos o del ancho de banda; una moda debe ser estable ante cambios razonables de ese ancho.
- **Curtosis negativa:** una mezcla de dos grupos simétricos bien separados tiene exceso de curtosis negativo.

:::figura[Propiedad de la separación mínima: con separación de 1.5 desviaciones estándar, los dos grupos producen una sola joroba ancha. La densidad estimada tiene un único máximo.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: modas
forma: mezcla
parametro: 1.5
centro: 170
escala: 6
variable: Estatura
unidad: cm
```
:::

## Errores comunes

- **Reportar la media de datos bimodales como valor típico.** En el ejemplo de la cafetería, la hora media, cerca de las once y veinte, describe un momento sin clientes.
- **Ver modas en el ruido.** Con pocos datos o intervalos angostos, aparecen picos pequeños que desaparecen al cambiar la semilla o el ancho; no son modas reales.
- **Concluir que no hay grupos porque hay una sola moda.** Dos grupos cercanos pueden producir una distribución unimodal; la ausencia de dos picos no prueba la ausencia de dos poblaciones.

:::figura[Picos de ruido: la misma mezcla de estaturas con solo 80 personas. Al reiniciar con otras semillas o al bajar el ancho de banda aparecen y desaparecen máximos pequeños.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: modas
forma: mezcla
parametro: 4
n: 80
centro: 170
escala: 6
variable: Estatura
unidad: cm
```
:::

## Conexiones

Cada máximo local es una [[moda]] de la distribución. La multimodalidad complica la lectura de la [[asimetria-muestral]] y de la [[curtosis-muestral-y-exceso-de-curtosis|curtosis]], que suponen implícitamente un solo grupo. Los modelos de mezclas y los métodos de agrupamiento buscan precisamente los componentes que la producen.

## Formulario

:::formula[Mezcla de dos componentes]
$$
f(x) = w\,f_1(x) + (1 - w)\,f_2(x)
$$

- $f_1$, $f_2$: densidades de los grupos.
- $w$: proporción del primer grupo, entre 0 y 1.
:::

:::formula[Mezcla de K componentes]
$$
f(x) = \sum_{k=1}^{K} w_k\,f_k(x), \qquad \sum_{k=1}^{K} w_k = 1
$$

- $w_k$: pesos no negativos; $f_k$: densidades de los componentes.
:::

:::formula[Condición de bimodalidad para dos normales iguales]
$$
|\mu_1 - \mu_2| > 2\sigma
$$

- $\mu_1$, $\mu_2$: medias de los componentes.
- $\sigma$: desviación estándar común; pesos iguales.
:::
