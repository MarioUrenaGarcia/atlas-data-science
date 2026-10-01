---
id: informacion-mutua-empirica
titulo: Información mutua empírica
titulo_en: Empirical mutual information
alias:
  - información mutua
  - mutual information
  - MI
modulo: 4
submodulo: '4.5'
orden: 12
nivel: intermedio
prerrequisitos:
  - tablas-de-contingencia
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - asociación
  - teoría de la información
  - entropía
  - dependencia general
resumen: >
  La información mutua empírica mide cuánto se reduce la incertidumbre sobre una variable al conocer la
  otra, a partir de las frecuencias de una tabla. Es cero solo si las frecuencias son independientes.
formula: '\hat{I}(X;Y) = \sum_{i,j}\hat{p}_{ij}\log\frac{\hat{p}_{ij}}{\hat{p}_{i\cdot}\,\hat{p}_{\cdot j}}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: contingencia
    enfoque: informacion
    filas:
      nombre: Tipo de correo
      categorias: [Promoción, Aviso, Personal]
    columnas:
      nombre: Abierto
      categorias: [Sí, No]
    conteos:
      - [20, 80]
      - [45, 55]
      - [70, 30]
referencias:
  - clave: cover-thomas
    capitulo: '2'
  - clave: murphy
publicado: true
---

## Intuición

Antes de saber de qué tipo es un correo, predecir si el destinatario lo abrirá es casi un volado: en total se abre el 45 %. Si se sabe que es una promoción, la incertidumbre baja mucho, porque solo se abre el 20 % de las promociones; si es personal, también baja, porque se abre el 70 %. Conocer el tipo de correo da **información** sobre si se abrirá.

La **información mutua** mide exactamente cuánta incertidumbre se elimina, en promedio, sobre una variable al conocer la otra. La incertidumbre se mide con la entropía de la teoría de la información, y la información mutua es la diferencia entre la entropía antes y después de conocer la segunda variable. Vale cero si conocer una no cambia en nada las probabilidades de la otra. A diferencia de la correlación, no supone ninguna forma de relación ni requiere que las categorías tengan orden: detecta cualquier tipo de dependencia.

## Definición

:::definicion[Información mutua empírica]
Con las proporciones conjuntas $\hat{p}_{ij} = n_{ij}/n$ y marginales $\hat{p}_{i\cdot} = n_{i\cdot}/n$, $\hat{p}_{\cdot j} = n_{\cdot j}/n$ de una tabla de contingencia, la **información mutua empírica** es
$$
\hat{I}(X;Y) = \sum_{i=1}^{I}\sum_{j=1}^{J}\hat{p}_{ij}\log\frac{\hat{p}_{ij}}{\hat{p}_{i\cdot}\,\hat{p}_{\cdot j}},
$$
con la convención $0 \log 0 = 0$. Equivalentemente, $\hat{I}(X;Y) = \hat{H}(Y) - \hat{H}(Y \mid X)$, la reducción de la entropía de $Y$ al conocer $X$.
:::

Con logaritmo natural se mide en **nats**; con logaritmo base 2, en **bits** ($1$ nat $\approx 1.443$ bits). Cada término compara la frecuencia observada de una celda con la que tendría bajo independencia, $\hat{p}_{i\cdot}\hat{p}_{\cdot j}$; los términos negativos aparecen en celdas con menos casos de los esperados, pero la suma total nunca es negativa.

:::figura[Dependencia perfecta en una tabla de 2 por 2: un sensor de puerta que siempre coincide con el estado real. Conocer una variable elimina toda la incertidumbre sobre la otra: la información mutua es log 2, un bit.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: informacion
filas:
  nombre: Puerta
  categorias: [Abierta, Cerrada]
columnas:
  nombre: Lectura del sensor
  categorias: [Abierta, Cerrada]
conteos:
  - [25, 0]
  - [0, 25]
```
:::

:::nota[Qué significa cada símbolo]
- $\hat{I}(X;Y)$: información mutua empírica entre $X$ y $Y$.
- $\hat{p}_{ij}$: proporción de observaciones en la celda $(i, j)$.
- $\hat{p}_{i\cdot}$, $\hat{p}_{\cdot j}$: proporciones marginales de la fila $i$ y la columna $j$.
- $n_{ij}$, $n_{i\cdot}$, $n_{\cdot j}$, $n$: conteos de la celda, de la fila, de la columna y total.
- $\log$: logaritmo natural (resultado en nats).
- $\hat{H}(Y)$: entropía empírica de $Y$, $-\sum_j \hat{p}_{\cdot j}\log\hat{p}_{\cdot j}$.
- $\hat{H}(Y \mid X)$: entropía de $Y$ dentro de cada categoría de $X$, promediada.
:::

## Cómo usar la visualización

La tabla cruza el tipo de correo con si fue abierto. La reproducción recorre las seis celdas; el encabezado muestra el término de cada una, proporción por logaritmo del cociente entre lo observado y lo esperado, y la suma acumulada. Al final se reporta la información mutua en nats y en bits.

Los avisos aportan cero: se abren al mismo ritmo que el promedio, así que su fila coincide con lo esperado. Las promociones y los correos personales aportan términos positivos en las celdas que sobran y negativos en las que faltan. Las barras muestran tres filas muy distintas entre sí.

## Ejemplo

Un pronóstico de lluvia y la lluvia observada en 20 días: pronosticó lluvia y llovió, 8; pronosticó lluvia y no llovió, 2; no la pronosticó y llovió, 2; no la pronosticó y no llovió, 8.

1. Proporciones conjuntas: $0.4, 0.1, 0.1, 0.4$. Marginales: $0.5$ en cada fila y cada columna; bajo independencia, cada celda tendría $0.25$.
2. Términos: $0.4\log(0.4/0.25) = 0.4 \cdot 0.470 = 0.188$ para cada celda de la diagonal, y $0.1\log(0.1/0.25) = 0.1 \cdot (-0.916) = -0.092$ para las otras dos.
3. Suma: $2(0.188) + 2(-0.092) \approx 0.193$ nats, o $0.193/\log 2 \approx 0.278$ bits.
4. El pronóstico reduce la incertidumbre sobre la lluvia de 1 bit (un volado) a unos 0.72 bits.

:::figura[El pronóstico del ejemplo, celda por celda.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: informacion
filas:
  nombre: Pronóstico
  categorias: [Lluvia, Sin lluvia]
columnas:
  nombre: Observado
  categorias: [Llovió, No llovió]
conteos:
  - [8, 2]
  - [2, 8]
```
:::

## Propiedades

- **No negativa:** $\hat{I}(X;Y) \ge 0$, con igualdad si y solo si la tabla es exactamente proporcional a sus marginales.
- **Acotada por las entropías:** $\hat{I}(X;Y) \le \min\big(\hat{H}(X), \hat{H}(Y)\big)$; alcanza la cota cuando una variable determina a la otra.
- **Simétrica:** $\hat{I}(X;Y) = \hat{I}(Y;X)$.
- **Relación con chi cuadrada:** para tablas grandes y asociación débil, $2n\,\hat{I} \approx \chi^2$; la estadística $G = 2n\,\hat{I}$ es la de razón de verosimilitudes.
- **No depende del orden ni de los nombres de las categorías.**

:::figura[Propiedad de no negatividad e independencia: preferencia por dos marcas en dos ciudades con las mismas proporciones. Todos los términos son cero y la información mutua también.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: informacion
filas:
  nombre: Ciudad
  categorias: [Mérida, Toluca]
columnas:
  nombre: Marca preferida
  categorias: [Marca A, Marca B]
conteos:
  - [20, 30]
  - [40, 60]
```
:::

## Errores comunes

- **Olvidar el sesgo con muestras pequeñas.** La información mutua empírica es positiva casi siempre, aunque las variables sean independientes, y el sesgo crece con el número de celdas y decrece con $n$.
- **Comparar valores en distintas unidades.** Un resultado en nats y otro en bits difieren por un factor de 1.443.
- **Comparar información mutua entre variables con muchas o pocas categorías.** Su máximo depende de las entropías; se usan versiones normalizadas para comparar.

:::figura[Sesgo con muestras pequeñas: seis lanzamientos de dos dados convertidos en par o impar, sin ninguna relación. La información mutua sale positiva solo por el azar del conteo.]{componente="AssociationViz"}
```yaml
modo: contingencia
enfoque: informacion
filas:
  nombre: Dado A
  categorias: [Par, Impar]
columnas:
  nombre: Dado B
  categorias: [Par, Impar]
conteos:
  - [2, 1]
  - [1, 2]
```
:::

## Conexiones

La información mutua se calcula sobre una [[tablas-de-contingencia|tabla de contingencia]] con [[funcion-exponencial-y-logaritmo-natural|logaritmos]] y mide la misma asociación que la [[v-de-cramer]] desde la teoría de la información. Para variables continuas se estima discretizando, como hace el [[coeficiente-de-informacion-maxima]]. En aprendizaje automático se usa para seleccionar variables y para dividir nodos en árboles de decisión, donde se llama ganancia de información.

## Formulario

:::formula[Información mutua empírica]
$$
\hat{I}(X;Y) = \sum_{i,j}\hat{p}_{ij}\log\frac{\hat{p}_{ij}}{\hat{p}_{i\cdot}\,\hat{p}_{\cdot j}}
$$

- $\hat{p}_{ij}$: proporción conjunta; $\hat{p}_{i\cdot}, \hat{p}_{\cdot j}$: marginales.
:::

:::formula[Como reducción de entropía]
$$
\hat{I}(X;Y) = \hat{H}(Y) - \hat{H}(Y \mid X)
$$

- $\hat{H}(Y)$: entropía de $Y$; $\hat{H}(Y \mid X)$: entropía condicional.
:::

:::formula[Entropía empírica]
$$
\hat{H}(Y) = -\sum_{j}\hat{p}_{\cdot j}\log\hat{p}_{\cdot j}
$$

- $\hat{p}_{\cdot j}$: proporción de la categoría $j$.
:::

:::formula[Conversión a bits]
$$
\hat{I}_{\text{bits}} = \frac{\hat{I}_{\text{nats}}}{\log 2}
$$

- $\log 2 \approx 0.693$.
:::

:::formula[Estadística G]
$$
G = 2n\,\hat{I}(X;Y) \approx \chi^2
$$

- $n$: total de observaciones; $\chi^2$: chi cuadrada de la tabla.
:::
