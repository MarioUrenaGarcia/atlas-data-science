---
id: transformaciones-de-potencia
titulo: Transformaciones de potencia
titulo_en: Power transforms
alias:
  - escalera de potencias de Tukey
  - power transformer
  - transformaciones para reducir asimetría
modulo: 12
submodulo: '12.3'
orden: 5
nivel: basico
prerrequisitos:
  - transformacion-de-yeo-johnson
etiquetas:
  - transformación
  - asimetría
  - preprocesamiento
  - ingeniería de características
resumen: >
  Las transformaciones de potencia reemplazan x por x elevada a lambda (o por su logaritmo cuando lambda es 0)
  para reducir la asimetría y estabilizar la varianza; lambda se elige con los datos de entrenamiento.
formula: "x^{(\\lambda)} = \\begin{cases} \\dfrac{x^{\\lambda} - 1}{\\lambda} & \\lambda \\ne 0 \\\\ \\log x & \\lambda = 0 \\end{cases}"
visualizacion:
  componente: FeatureTransformViz
  parametros:
    modo: box-cox
    muestra:
      nombre: Tiempo de respuesta
      forma: sesgo-derecha
      parametro: 1.5
      centro: 60
      escala: 40
      n: 300
    eje:
      variable: Tiempo de respuesta de un servidor
      unidad: ms
referencias:
  - clave: james-isl
  - clave: hastie-esl
publicado: true
---

## Intuición

Los tiempos de respuesta de un servidor web suelen ser cortos, con una cola larga de solicitudes muy lentas. Un modelo lineal que use esa variable tal cual queda dominado por unos cuantos tiempos enormes: la mayor parte de la información está apretada en la zona baja y los extremos tienen una palanca desproporcionada. Tomar la raíz cuadrada o el logaritmo "estira" la zona baja y "comprime" la cola, y la variable queda más simétrica.

Raíz, logaritmo y recíproco son puntos de una misma familia: elevar a una potencia $\lambda$. Con $\lambda = 1$ no cambia nada; con $\lambda = 0.5$ se toma la raíz; el logaritmo corresponde a $\lambda = 0$; con $\lambda = -1$, el recíproco. Cuanto menor es $\lambda$, más se comprime la cola derecha. Como herramienta de preparación de datos, la elección de $\lambda$ se automatiza: se busca el valor que deja la variable lo más cercana posible a una normal, con la familia de Box-Cox si los datos son positivos o la de Yeo-Johnson si hay ceros o negativos, y ese $\lambda$ se guarda para aplicarlo igual a los datos nuevos.

## Definición

:::definicion[Transformación de potencia]
Para $x > 0$, la familia de **transformaciones de potencia** de Box-Cox es

$$
x^{(\lambda)} = \begin{cases} \dfrac{x^{\lambda} - 1}{\lambda} & \lambda \ne 0, \\[4pt] \log x & \lambda = 0. \end{cases}
$$

Restar 1 y dividir entre $\lambda$ hace que la familia sea continua en $\lambda$ y siempre creciente. El parámetro se estima maximizando la log-verosimilitud perfilada bajo normalidad de los datos transformados:

$$
\hat{\lambda} = \arg\max_{\lambda} \left[ -\frac{n}{2}\log \hat{\sigma}^2(\lambda) + (\lambda - 1)\sum_{i=1}^{n} \log x_i \right].
$$
:::

:::nota[Qué significa cada símbolo]
- $x$, $x_i$: valor original positivo, y valor de la observación $i$.
- $\lambda$: exponente de la transformación.
- $x^{(\lambda)}$: valor transformado.
- $\log$: logaritmo natural.
- $n$: número de observaciones de entrenamiento.
- $\hat{\sigma}^2(\lambda)$: varianza de los datos transformados con $\lambda$.
- $(\lambda - 1)\sum \log x_i$: logaritmo del jacobiano de la transformación, que compensa el cambio de escala.
- $\hat{\lambda}$: exponente estimado.
:::

## Cómo usar la visualización

El histograma muestra los datos transformados con el valor actual de $\lambda$, junto con la curva normal de la misma media y desviación. Debajo, la curva de log-verosimilitud perfil indica qué tan bien queda la normal para cada $\lambda$, con una línea en su máximo, $\hat{\lambda}$. Al reproducir, $\lambda$ recorre todo el rango; al terminar, vuelve al valor del control, que parte del $\lambda$ estimado. Las lecturas comparan la asimetría original con la transformada.

Experimentos sugeridos: mover $\lambda$ a 1 y ver que el histograma conserva la forma de los datos originales, solo desplazado; moverlo a 0 (logaritmo) y comparar la asimetría con la del $\lambda$ óptimo; probar $\lambda = -1$ y observar que la cola se invierte.

## Ejemplo

Cinco tiempos de respuesta, en milisegundos: 1, 4, 9, 16 y 100.

1. $\lambda = 1$: $x - 1$ da 0, 3, 8, 15 y 99. La cola es enorme.
2. $\lambda = 0.5$: $(\sqrt{x} - 1)/0.5$ da 0, 2, 4, 6 y 18. Los cuatro primeros quedan equiespaciados y el último se acerca.
3. $\lambda = 0$: $\log x$ da 0, 1.386, 2.197, 2.773 y 4.605. La cola casi desaparece.
4. $\lambda = -1$: $(x^{-1} - 1)/(-1) = 1 - 1/x$ da 0, 0.75, 0.889, 0.938 y 0.99. Ahora los valores grandes se amontonan y la asimetría cambia de lado.

La estimación por máxima verosimilitud da $\hat{\lambda} = -0.060$, muy cerca del logaritmo: con estos cinco tiempos, $\lambda = 0$ es prácticamente la transformación óptima.

:::figura[Los cinco tiempos del ejemplo con su curva de log-verosimilitud en función de lambda.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
muestra:
  nombre: Tiempos
  valores: [1, 4, 9, 16, 100]
eje:
  variable: Tiempo de respuesta
  unidad: ms
```
:::

## Propiedades

- **Son monótonas crecientes.** Conservan el orden de los datos, así que los modelos basados en rangos o en árboles no cambian.
- **Reducen la influencia de la cola larga** en métodos lineales y de distancias, y a menudo hacen más constante la varianza de los errores.

:::figura[Población de municipios, con una cola extremadamente larga: el lambda estimado queda cerca de cero, es decir, cerca del logaritmo.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
muestra:
  nombre: Población
  forma: sesgo-derecha
  parametro: 0.3
  centro: 14
  escala: 25
  n: 300
eje:
  variable: Población del municipio
  unidad: miles
```
:::

- **Box-Cox exige valores positivos; Yeo-Johnson no.** Con ceros o negativos, como cambios porcentuales, se usa Yeo-Johnson.

:::figura[Ganancias y pérdidas mensuales de tiendas, con valores negativos: la familia de Yeo-Johnson encuentra un lambda que reduce la asimetría sin exigir datos positivos.]{componente="FeatureTransformViz"}
```yaml
modo: yeo-johnson
muestra:
  nombre: Ganancias
  forma: sesgo-derecha
  parametro: 1.5
  centro: -2
  escala: 15
  n: 300
eje:
  variable: Ganancia mensual
  unidad: miles de pesos
```
:::

## Errores comunes

- **Estimar lambda con todos los datos.** El exponente es un parámetro aprendido; se estima con el entrenamiento y se aplica tal cual a la prueba.
- **Esperar normalidad perfecta.** La transformación reduce la asimetría, pero no crea una normal si los datos son bimodales o tienen masa en un punto.
- **Interpretar coeficientes en la escala original.** Un coeficiente sobre $\log x$ mide el efecto de un cambio relativo en $x$, no de un cambio absoluto.

:::figura[Error de esperar normalidad perfecta: datos de dos grupos mezclados. Ningún lambda produce una normal, porque la transformación no puede unir los dos picos.]{componente="FeatureTransformViz"}
```yaml
modo: box-cox
muestra:
  nombre: Mezcla
  forma: mezcla
  centro: 30
  escala: 6
  n: 300
eje:
  variable: Duración de llamadas de dos centros de atención
  unidad: min
```
:::

## Conexiones

Los dos casos particulares más usados se estudian en [[transformacion-de-box-cox]] y [[transformacion-de-yeo-johnson]], y los miembros más simples de la familia en [[transformacion-logaritmica-y-de-raiz]]. Su objetivo es corregir la [[asimetria-muestral]] y las [[colas-ligeras-y-pesadas-en-datos|colas pesadas]], algo que la [[estandarizacion]] no hace porque es lineal. El logaritmo, caso $\lambda = 0$, es la [[funcion-exponencial-y-logaritmo-natural|función logaritmo natural]].

## Formulario

:::formula[Familia de Box-Cox]
$$
x^{(\lambda)} = \begin{cases} \dfrac{x^{\lambda} - 1}{\lambda} & \lambda \ne 0 \\[4pt] \log x & \lambda = 0 \end{cases}
$$

- $x > 0$: valor original; $x^{(\lambda)}$: valor transformado.
- $\lambda$: exponente.
- $\log$: logaritmo natural.
:::

:::formula[Estimación de lambda]
$$
\hat{\lambda} = \arg\max_{\lambda} \left[ -\frac{n}{2}\log \hat{\sigma}^2(\lambda) + (\lambda - 1)\sum_{i=1}^{n} \log x_i \right]
$$

- $\hat{\lambda}$: exponente estimado, el que maximiza la expresión entre corchetes.
- $\arg\max_{\lambda}$: valor de $\lambda$ que hace máxima la expresión.
- $n$: tamaño de la muestra de entrenamiento.
- $\hat{\sigma}^2(\lambda)$: varianza de los transformados.
- $x_i$: valores originales.
- $\log$: logaritmo natural.
:::
