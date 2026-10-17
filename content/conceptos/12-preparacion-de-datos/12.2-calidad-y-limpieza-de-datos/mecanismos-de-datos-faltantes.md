---
id: mecanismos-de-datos-faltantes
titulo: Mecanismos de datos faltantes (MCAR, MAR, MNAR)
titulo_en: Missing data mechanisms (MCAR, MAR, MNAR)
alias:
  - MCAR
  - MAR
  - MNAR
  - faltantes completamente al azar
  - faltantes al azar
  - faltantes no al azar
modulo: 12
submodulo: '12.2'
orden: 5
nivel: basico
prerrequisitos:
  - dimensiones-de-la-calidad-de-datos
  - patrones-de-valores-faltantes
  - independencia-condicional
etiquetas:
  - datos faltantes
  - sesgo
  - imputación
  - probabilidad condicional
resumen: >
  El mecanismo de faltantes describe de qué depende que un valor falte: de nada (MCAR), de otras variables
  observadas (MAR) o del propio valor no observado (MNAR). De él depende qué análisis da resultados sin sesgo.
formula: 'P(M \mid Y_{\text{obs}}, Y_{\text{mis}}) = P(M \mid Y_{\text{obs}})'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: mecanismos
    mecanismo: MAR
    tasa: 0.3
    fuerza: 1.5
referencias:
  - clave: gelman-bda
  - clave: lohr
publicado: true
---

## Intuición

En una encuesta de hogares, el 30 % de las personas no responde la pregunta de ingreso. Lo que se puede concluir con el 70 % restante depende de **por qué** falta la respuesta. Si las hojas se mojaron al azar durante el traslado, los que respondieron son una muestra al azar de todos y su promedio no tiene sesgo. Si las personas mayores, que tienden a ganar más, omiten la pregunta con más frecuencia, el promedio de los que respondieron es bajo; pero como la edad sí se registró, se puede corregir comparando personas de la misma edad. Si quienes ganan más omiten la pregunta precisamente porque ganan más, el sesgo depende de lo que no se ve y ningún dato observado permite corregirlo por completo.

Estos tres escenarios son los **mecanismos de datos faltantes**: completamente al azar, al azar condicionado a lo observado y no al azar. No son propiedades de la tabla que se puedan leer en ella, sino supuestos sobre el proceso que generó los huecos, y cada método de tratamiento es válido solo bajo alguno de ellos.

## Definición

Sea $\mathbf{Y}$ la matriz completa de datos, dividida en la parte observada $\mathbf{Y}_{\text{obs}}$ y la faltante $\mathbf{Y}_{\text{mis}}$, y sea $\mathbf{M}$ la matriz indicadora de faltantes.

:::definicion[Mecanismos de faltantes]
- **MCAR** (missing completely at random): $P(\mathbf{M} \mid \mathbf{Y}_{\text{obs}}, \mathbf{Y}_{\text{mis}}) = P(\mathbf{M})$. Faltar no depende de ningún dato.
- **MAR** (missing at random): $P(\mathbf{M} \mid \mathbf{Y}_{\text{obs}}, \mathbf{Y}_{\text{mis}}) = P(\mathbf{M} \mid \mathbf{Y}_{\text{obs}})$. Faltar depende solo de valores observados.
- **MNAR** (missing not at random): la probabilidad de faltar depende de $\mathbf{Y}_{\text{mis}}$ aun después de condicionar en $\mathbf{Y}_{\text{obs}}$.
:::

En la visualización, el ingreso $y_i$ de la persona $i$ falta con probabilidad

$$
P(M_i = 1) = \sigma(\alpha + \gamma\, z_i), \qquad \sigma(t) = \frac{1}{1 + e^{-t}},
$$

donde $z_i$ es la edad estandarizada (MAR) o el propio ingreso estandarizado (MNAR), y $\gamma = 0$ en MCAR.

:::nota[Qué significa cada símbolo]
- $\mathbf{Y}$: matriz de todos los valores, observados o no.
- $\mathbf{Y}_{\text{obs}}$, $\mathbf{Y}_{\text{mis}}$: valores observados y valores faltantes.
- $\mathbf{M}$: matriz con $M_{ij} = 1$ si el valor de la fila $i$ y la columna $j$ falta y $0$ si se observa.
- $P(\mathbf{M} \mid \cdot)$: probabilidad del patrón de faltantes dados los datos.
- $M_i$: indicadora de que falta el ingreso de la persona $i$.
- $\sigma$: función logística, que lleva cualquier número real a una probabilidad.
- $\alpha$: constante que fija la proporción promedio de faltantes.
- $\gamma$: fuerza con la que $z_i$ cambia la probabilidad de faltar.
- $z_i$: variable estandarizada que determina el mecanismo.
:::

## Cómo usar la visualización

Cada punto azul es una persona con edad e ingreso observados. Cuando el ingreso falta, solo queda una marca roja sobre el eje en su edad; el círculo rojo vacío muestra el ingreso oculto, que en datos reales nunca se conoce. La línea punteada azul es la media de los ingresos observados y la gris, la media verdadera. Las barras comparan la proporción de faltantes entre edades bajas y altas, y entre ingresos bajos y altos.

Experimentos sugeridos: con MCAR, las cuatro barras son parecidas y las dos medias coinciden. Con MAR, las barras de edad difieren. Con MNAR, la diferencia aparece en las barras de ingreso, que en la práctica no se pueden calcular. Subir la fuerza agranda el sesgo de la media observada.

## Ejemplo

Seis personas tienen ingresos de 10, 14, 18, 22, 26 y 30 mil pesos; la media es 20. Faltan dos respuestas.

1. **MCAR:** se mojan al azar las hojas con 14 y 26. La media observada es $(10 + 18 + 22 + 30)/4 = 20$: sin sesgo en este caso, y sin sesgo en promedio sobre todas las elecciones al azar.
2. **MNAR:** no responden los dos ingresos más altos, 26 y 30. La media observada es $(10 + 14 + 18 + 22)/4 = 16$: un sesgo de $-4$.
3. **MAR:** no responden las dos personas de mayor edad. Si son las de 26 y 30, la media observada también es 16, pero la edad está registrada: entre personas de la misma edad, faltar ya no depende del ingreso, y un modelo de ingreso según la edad corrige el sesgo.

:::figura[MNAR con fuerza 2: faltan sobre todo los ingresos altos, la media observada queda por debajo de la verdadera y las barras de edad apenas lo delatan.]{componente="DataQualityTable"}
```yaml
modo: mecanismos
mecanismo: MNAR
tasa: 0.3
fuerza: 2
```
:::

## Propiedades

- **Bajo MCAR, los casos completos son una muestra al azar** y cualquier estadístico calculado con ellos es insesgado, aunque menos preciso.

:::figura[MCAR: los faltantes se reparten igual en todas las edades e ingresos y la media observada coincide con la verdadera, salvo por variación aleatoria.]{componente="DataQualityTable"}
```yaml
modo: mecanismos
mecanismo: MCAR
tasa: 0.3
```
:::

- **Bajo MAR, el sesgo se puede corregir** con métodos que usan las variables observadas: imputación por modelos, imputación múltiple o ponderación.
- **MAR y MNAR no se distinguen con los datos observados.** Que la proporción de faltantes dependa de la edad muestra que no es MCAR; que además dependa del ingreso oculto no puede comprobarse sin información externa.

:::figura[MAR: los faltantes se concentran en las edades altas; como la edad y el ingreso están correlacionados, la media observada también queda sesgada.]{componente="DataQualityTable"}
```yaml
modo: mecanismos
mecanismo: MAR
tasa: 0.4
fuerza: 2
```
:::

## Errores comunes

- **Llamar "al azar" a MAR en sentido coloquial.** MAR no significa que los faltantes sean aleatorios; significa que su dependencia se explica por variables observadas.
- **Concluir MCAR porque una prueba no detecta diferencias.** Una prueba solo compara variables observadas; un mecanismo MNAR puede pasarla sin problema.
- **Pensar que pocos faltantes no sesgan.** Con 10 % de faltantes MNAR concentrados en los valores más altos, la media observada ya se desplaza.

:::figura[Error de pensar que pocos faltantes no sesgan: con solo 10 % de ingresos faltantes por MNAR, la media observada sigue por debajo de la verdadera.]{componente="DataQualityTable"}
```yaml
modo: mecanismos
mecanismo: MNAR
tasa: 0.1
fuerza: 3
```
:::

## Conexiones

Las definiciones son enunciados de [[independencia-condicional]] entre la indicadora de faltantes y los datos, y la probabilidad de faltar se modela con la [[funcion-sigmoide-y-funcion-softplus|función sigmoide]]. Los [[patrones-de-valores-faltantes]] muestran dónde faltan los datos y la completitud de [[dimensiones-de-la-calidad-de-datos]] dice cuánto falta; el mecanismo dice si eso sesga. Los métodos de tratamiento son la [[eliminacion-por-lista-y-por-pares]], la [[imputacion-simple]], la [[imputacion-por-k-vecinos-mas-cercanos]] y la [[imputacion-multiple]], y una forma de usar la ausencia como información es el [[indicador-de-valor-faltante]]. El sesgo por respuestas faltantes es un caso de la diferencia entre [[poblacion-y-muestra]].

## Formulario

:::formula[MCAR]
$$
P(\mathbf{M} \mid \mathbf{Y}_{\text{obs}}, \mathbf{Y}_{\text{mis}}) = P(\mathbf{M})
$$

- $\mathbf{M}$: indicadoras de faltantes.
- $\mathbf{Y}_{\text{obs}}$, $\mathbf{Y}_{\text{mis}}$: datos observados y faltantes.
:::

:::formula[MAR]
$$
P(\mathbf{M} \mid \mathbf{Y}_{\text{obs}}, \mathbf{Y}_{\text{mis}}) = P(\mathbf{M} \mid \mathbf{Y}_{\text{obs}})
$$

- La probabilidad de faltar depende solo de lo observado.
:::

:::formula[Modelo logístico de faltantes]
$$
P(M_i = 1) = \sigma(\alpha + \gamma\, z_i) = \frac{1}{1 + e^{-(\alpha + \gamma z_i)}}
$$

- $M_i$: indicadora de que falta el valor de la fila $i$.
- $\alpha$: constante que fija la tasa de faltantes.
- $\gamma$: fuerza de la dependencia; $\gamma = 0$ da MCAR.
- $z_i$: variable estandarizada de la que depende el faltante.
:::

:::formula[Sesgo de la media de casos completos]
$$
\text{sesgo} = \bar{y}_{\text{obs}} - \bar{y}
$$

- $\bar{y}_{\text{obs}}$: media de los valores observados.
- $\bar{y}$: media de todos los valores, incluidos los ocultos.
:::
