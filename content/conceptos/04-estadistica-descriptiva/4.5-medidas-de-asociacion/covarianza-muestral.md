---
id: covarianza-muestral
titulo: Covarianza muestral
titulo_en: Sample covariance
alias:
  - covarianza
  - s_xy
modulo: 4
submodulo: '4.5'
orden: 1
nivel: basico
prerrequisitos:
  - varianza-muestral
etiquetas:
  - asociación
  - covarianza
  - relación lineal
  - productos cruzados
resumen: >
  La covarianza muestral promedia los productos de las desviaciones de dos variables respecto a sus
  medias. Es positiva si tienden a crecer juntas y negativa si una crece cuando la otra decrece.
formula: 's_{xy} = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: correlacion
    medida: covarianza
    lecturas: [covarianza, pearson]
    puntos: [[2, 3], [4, 4], [5, 7], [7, 6], [9, 10]]
    nombres:
      x: Horas de estudio a la semana
      y: Calificación del examen
    decimales: 0
referencias:
  - clave: degroot
  - clave: casella-berger
    capitulo: '4'
publicado: true
---

## Intuición

Cinco estudiantes anotan cuántas horas estudiaron y qué calificación obtuvieron. Si se trazan dos líneas, una en la media de horas y otra en la media de calificaciones, el plano queda dividido en cuatro cuadrantes. Un estudiante que estudió más que el promedio y sacó más que el promedio cae arriba a la derecha; uno que estudió menos y sacó menos, abajo a la izquierda. Ambos apoyan la idea de que las dos variables van juntas. Los que caen en los otros dos cuadrantes la contradicen.

La **covarianza** convierte ese conteo en un número. Para cada observación multiplica su distancia horizontal a la media por su distancia vertical: el producto es positivo en los cuadrantes que van de acuerdo y negativo en los que no. Geométricamente, cada producto es el área de un rectángulo con esquinas en el punto y en el centro de los datos. Si las áreas positivas dominan, la covarianza es positiva; si dominan las negativas, es negativa; si se compensan, es cercana a cero.

## Definición

:::definicion[Covarianza muestral]
Para pares observados $(x_1, y_1), \dots, (x_n, y_n)$ con medias $\bar{x}$ y $\bar{y}$,
$$
s_{xy} = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y}).
$$
Su versión poblacional es $\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big]$.
:::

Tiene como unidades el producto de las unidades de $x$ y de $y$ (horas por puntos, en el ejemplo). La covarianza de una variable consigo misma es su varianza: $s_{xx} = s_x^2$.

:::figura[Covarianza negativa: precio de un boleto de autobús y número de pasajeros en 25 rutas simuladas. Dominan los rectángulos naranjas de los cuadrantes que van en contra.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: covarianza
lecturas: [covarianza]
generador:
  tipo: lineal
  n: 25
  ruido: 0.4
  pendiente: -1
nombres:
  x: Precio del boleto
  y: Pasajeros por día
```
:::

:::nota[Qué significa cada símbolo]
- $s_{xy}$: covarianza muestral entre $x$ y $y$.
- $x_i, y_i$: valores de las dos variables en la observación $i$.
- $\bar{x}, \bar{y}$: medias muestrales.
- $(x_i - \bar{x})(y_i - \bar{y})$: producto de las desviaciones, área con signo del rectángulo de la observación $i$.
- $n$: número de pares observados.
- $\operatorname{Cov}(X, Y)$: covarianza poblacional; $\mathbb{E}$: valor esperado; $\mu_X, \mu_Y$: medias poblacionales.
:::

## Cómo usar la visualización

Cada punto es un estudiante; las líneas discontinuas marcan las dos medias. La reproducción dibuja el rectángulo de cada estudiante, en azul si su producto es positivo y en naranja si es negativo, y el encabezado acumula la suma de productos. Al final la divide entre $n - 1$.

Al arrastrar el estudiante de 5 horas hacia arriba y a la izquierda, su rectángulo pasa al cuadrante naranja y la covarianza baja. Al alejar el estudiante de 9 horas hacia la esquina superior derecha, su rectángulo crece mucho y la covarianza sube: los puntos lejanos del centro pesan más.

## Ejemplo

Horas de estudio: 2, 4, 5, 7, 9. Calificaciones: 3, 4, 7, 6, 10.

1. Medias: $\bar{x} = 27/5 = 5.4$ horas y $\bar{y} = 30/5 = 6$ puntos.
2. Desviaciones de $x$: $-3.4, -1.4, -0.4, 1.6, 3.6$. Desviaciones de $y$: $-3, -2, 1, 0, 4$.
3. Productos: $10.2,\ 2.8,\ -0.4,\ 0,\ 14.4$. Suma: $27$.
4. Covarianza: $s_{xy} = 27/(5 - 1) = 6.75$ horas por punto.
5. Cuatro productos son positivos o nulos y uno negativo pequeño: la asociación es positiva.

:::figura[Los cinco estudiantes del ejemplo con sus rectángulos; al final el encabezado muestra 27/4 = 6.75.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: covarianza
lecturas: [covarianza]
puntos: [[2, 3], [4, 4], [5, 7], [7, 6], [9, 10]]
nombres:
  x: Horas de estudio
  y: Calificación
decimales: 0
```
:::

## Propiedades

- **Simetría:** $s_{xy} = s_{yx}$.
- **Depende de las unidades:** si $u_i = a + b x_i$ y $v_i = c + d y_i$, entonces $s_{uv} = b\,d\,s_{xy}$. Medir las horas en minutos multiplica la covarianza por 60.
- **Cota de Cauchy-Schwarz:** $|s_{xy}| \le s_x\,s_y$; dividir entre ese producto da la correlación de Pearson.
- **Varianza de una suma:** $s^2_{x+y} = s_x^2 + s_y^2 + 2 s_{xy}$.
- **Solo mide relación lineal:** puede ser cero aunque $y$ dependa completamente de $x$.

:::figura[Propiedad de las unidades: los mismos datos con el tiempo medido en décimas de hora (20, 40, 50, 70 y 90). Los rectángulos se estiran horizontalmente y la covarianza se multiplica por 10, aunque la relación es la misma.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: covarianza
lecturas: [covarianza, pearson]
puntos: [[20, 3], [40, 4], [50, 7], [70, 6], [90, 10]]
nombres:
  x: Décimas de hora de estudio
  y: Calificación
decimales: 0
```
:::

## Errores comunes

- **Interpretar la magnitud de la covarianza.** Una covarianza de 6.75 no es "grande" ni "pequeña" por sí misma; depende de las unidades. Para comparar intensidad se usa la correlación.
- **Concluir independencia porque la covarianza es cero.** Una relación en forma de U produce productos que se cancelan.
- **Confundir covarianza con causalidad.** Que dos variables varíen juntas no indica que una produzca la otra.

:::figura[Covarianza cercana a cero con dependencia fuerte: consumo de energía de un edificio contra la temperatura exterior, alto con frío y con calor. Los rectángulos positivos y negativos se compensan.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: covarianza
lecturas: [covarianza, pearson]
generador:
  tipo: parabola
  n: 30
  ruido: 0.2
nombres:
  x: Temperatura exterior
  y: Consumo de energía
```
:::

## Conexiones

La covarianza generaliza la [[varianza-muestral]] a dos variables y se normaliza para obtener el [[coeficiente-de-correlacion-de-pearson]]. Las covarianzas de varias variables forman la matriz de covarianza $\boldsymbol{\Sigma}$, base del análisis multivariado; su versión estandarizada es la [[matriz-de-correlacion]]. Que la covarianza sea cero no implica independencia, como muestra la [[correlacion-de-distancia]].

## Formulario

:::formula[Covarianza muestral]
$$
s_{xy} = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})
$$

- $x_i, y_i$: valores del par $i$; $\bar{x}, \bar{y}$: medias; $n$: número de pares.
:::

:::formula[Cambio de unidades]
$$
s_{(a + bx)(c + dy)} = b\,d\,s_{xy}
$$

- $a, c$: desplazamientos, sin efecto.
- $b, d$: factores de escala de cada variable.
:::

:::formula[Varianza de una suma]
$$
s^2_{x+y} = s_x^2 + s_y^2 + 2\,s_{xy}
$$

- $s_x^2, s_y^2$: varianzas de cada variable.
:::

:::formula[Cota de Cauchy-Schwarz]
$$
|s_{xy}| \le s_x\,s_y
$$

- $s_x, s_y$: desviaciones estándar.
:::
