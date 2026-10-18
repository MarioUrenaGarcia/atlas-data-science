---
id: codificacion-ciclica-con-seno-y-coseno
titulo: Codificación cíclica con seno y coseno
titulo_en: Cyclical encoding with sine and cosine
alias:
  - codificación circular
  - cyclical encoding
  - variables periódicas
modulo: 12
submodulo: '12.3'
orden: 16
nivel: basico
prerrequisitos:
  - caracteristicas-de-fecha-y-hora
  - coordenadas-polares-cilindricas-y-esfericas
etiquetas:
  - ingeniería de características
  - variables cíclicas
  - trigonometría
  - fechas
resumen: >
  Una variable periódica (hora, día de la semana, mes) se representa con dos columnas, el seno y el coseno de
  su ángulo en el ciclo, para que valores contiguos como 23 h y 0 h queden cerca.
formula: 'x \mapsto \left(\sin\frac{2\pi x}{P},\ \cos\frac{2\pi x}{P}\right)'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: ciclica
    periodo: horas
    a: 23
    b: 0
referencias:
  - clave: hyndman-fpp
  - clave: james-isl
publicado: true
---

## Intuición

Como número, la hora del día va de 0 a 23, y la distancia entre las 23 h y las 0 h es 23: las dos horas parecen lo más diferentes posible. En realidad son consecutivas. Un modelo que mida distancias o que ajuste efectos suaves en la hora tratará las 23 h 30 min y las 0 h 30 min como momentos opuestos, y aprenderá con dificultad que la madrugada empieza antes y termina después de la medianoche.

La **codificación cíclica** coloca los valores sobre un círculo, como las horas en la carátula de un reloj. Cada hora se convierte en un ángulo, una fracción de la vuelta completa, y se representa con dos números: el seno y el coseno de ese ángulo, es decir, las coordenadas del punto en el círculo. En ese círculo, las 23 h y las 0 h están juntas, y las 12 h quedan del lado opuesto a la medianoche. Hacen falta las dos coordenadas: solo con el seno, las 3 h y las 9 h tendrían el mismo valor.

## Definición

:::definicion[Codificación cíclica]
Sea $x$ una variable periódica con periodo $P$ (por ejemplo, $P = 24$ para la hora). Su **codificación cíclica** es

$$
x \mapsto \left(\sin\frac{2\pi x}{P},\ \cos\frac{2\pi x}{P}\right).
$$

La distancia euclidiana entre las codificaciones de $x$ y $y$ es

$$
d(x, y) = 2\sin\left(\frac{\pi\,|x - y|}{P}\right),
$$

que depende de la separación más corta alrededor del ciclo y vale como máximo $2$.
:::

:::nota[Qué significa cada símbolo]
- $x$, $y$: valores de la variable periódica.
- $P$: periodo, el número de valores antes de que el ciclo se repita.
- $2\pi x / P$: ángulo, en radianes, del valor $x$ en el círculo.
- $\sin$, $\cos$: seno y coseno; dan las coordenadas del punto en un círculo de radio $1$.
- $d(x, y)$: distancia entre los dos puntos del círculo.
:::

## Cómo usar la visualización

Los valores del ciclo aparecen primero sobre una recta, en orden; al reproducir, la recta se curva hasta cerrarse en un círculo. Los dos valores elegidos se marcan en rojo y la línea naranja mide su distancia. El encabezado calcula las coordenadas del primer valor y la distancia en el círculo. Las lecturas comparan la diferencia como número con la distancia cíclica.

Experimentos sugeridos: con las horas 23 y 0, comparar la diferencia lineal de 23 con la distancia cíclica; cambiar a 0 y 12 para obtener la máxima distancia, 2; probar meses y días de la semana.

## Ejemplo

Hora 23 y hora 0, con $P = 24$:

1. Ángulo de las 23 h: $2\pi(23)/24 = 6.021$ rad (345°). Coordenadas: $(\sin, \cos) = (-0.259,\ 0.966)$.
2. Ángulo de las 0 h: $0$. Coordenadas: $(0,\ 1)$.
3. Distancia: $\sqrt{0.259^2 + 0.034^2} = 0.261$, que coincide con $2\sin(\pi/24) = 0.261$.
4. Entre las 0 h y las 12 h: $2\sin(12\pi/24) = 2\sin(\pi/2) = 2$, la mayor distancia posible.
5. Solo con el seno, las 3 h y las 9 h darían $\sin(\pi/4) = \sin(3\pi/4) = 0.707$: indistinguibles. El coseno, $0.707$ y $-0.707$, las separa.

:::figura[Las horas 0 y 12 quedan en lados opuestos del círculo, a la distancia máxima, igual a 2.]{componente="FeatureEngineeringViz"}
```yaml
modo: ciclica
periodo: horas
a: 0
b: 12
```
:::

## Propiedades

- **Conserva la continuidad del ciclo.** Valores contiguos, incluido el último con el primero, quedan siempre a la misma distancia corta.
- **Las dos columnas están en $[-1, 1]$.** No hace falta escalarlas.
- **Funciona para cualquier periodo.** Meses ($P = 12$), días de la semana ($P = 7$), ángulos de viento ($P = 360$).

:::figura[Días de la semana con periodo 7: domingo y lunes quedan contiguos en el círculo.]{componente="FeatureEngineeringViz"}
```yaml
modo: ciclica
periodo: dias
a: 6
b: 0
```
:::

## Errores comunes

- **Usar solo el seno o solo el coseno.** Cada uno, por separado, asigna el mismo valor a dos puntos distintos del ciclo.
- **Aplicarla a variables sin ciclo.** La edad o el año no se repiten; ponerlos en un círculo inventa una cercanía entre valores lejanos.
- **Esperar que un árbol de decisión la aproveche igual.** Los árboles cortan una columna a la vez y necesitan dos cortes para aislar una franja del círculo; para ellos, a veces funciona mejor la hora como categoría.

:::figura[Lo que se pierde al tratar el mes como número: noviembre y febrero están a 9 unidades como números, pero en el círculo quedan a la misma distancia que dos meses separados por tres, como junio y septiembre.]{componente="FeatureEngineeringViz"}
```yaml
modo: ciclica
periodo: meses
a: 10
b: 1
```
:::

## Conexiones

Es la representación en [[coordenadas-polares-cilindricas-y-esfericas|coordenadas polares]] de un punto en el círculo unitario, y la distancia resultante es la longitud de una cuerda, una aplicación de las [[normas-vectoriales]]. Se aplica a las variables extraídas en [[caracteristicas-de-fecha-y-hora]]. La [[distribucion-de-von-mises]] es la distribución de probabilidad natural para variables en un círculo.

## Formulario

:::formula[Codificación cíclica]
$$
x \mapsto \left(\sin\frac{2\pi x}{P},\ \cos\frac{2\pi x}{P}\right)
$$

- $x$: valor periódico; $P$: periodo.
:::

:::formula[Distancia en el círculo]
$$
d(x, y) = 2\sin\left(\frac{\pi\,|x - y|}{P}\right)
$$

- $|x - y|$: separación entre los valores, con $0 \le |x - y| \le P$.
:::
