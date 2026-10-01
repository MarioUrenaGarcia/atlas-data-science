---
id: distribucion-chi-cuadrada
titulo: Distribución chi-cuadrada
titulo_en: Chi-squared distribution
alias:
  - ji cuadrada
  - chi cuadrado
  - χ²
modulo: 2
submodulo: '2.2'
orden: 9
nivel: basico
prerrequisitos:
  - normal-estandar-y-puntuacion-z
  - distribucion-gamma
relaciones:
  - tipo: caso-particular
    id: distribucion-gamma
etiquetas:
  - distribución continua
  - suma de cuadrados
  - grados de libertad
  - pruebas de hipótesis
resumen: >
  Es la distribución de la suma de los cuadrados de k normales estándar independientes. El número k se
  llama grados de libertad; su media es k y su varianza 2k.
formula: 'Q = Z_1^{2} + \dots + Z_k^{2} \sim \chi^{2}_{k}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: chi-cuadrada
      valores:
        k: 3
      dominio: [0, 30]
      casos:
        - nombre: 'Un grado'
          descripcion: 'El cuadrado de una sola normal: casi siempre pequeño, con densidad infinita en cero.'
          valores: {k: 1}
        - nombre: 'Error del dron'
          descripcion: 'Tres ejes de error al cuadrado: media 3 y moda 1, con cola a la derecha.'
          valores: {k: 3}
        - nombre: 'Doce sumandos'
          descripcion: 'Con 12 grados la suma ya se parece a una normal de media 12 y varianza 24.'
          valores: {k: 12}
        - nombre: 'Tabla chica'
          descripcion: 'k = 2: sesgo fuerte; tablas de contingencia chicas o ajustes con pocas categorías.'
          valores: {k: 2}
        - nombre: 'Análisis mediano'
          descripcion: 'k = 5: sesgo moderado; análisis categóricos de tamaño mediano.'
          valores: {k: 5}
      ejemplo:
        titulo: 'Aterrizaje del dron'
        contexto: 'El error de aterrizaje de un dron es normal estándar en cada uno de tres ejes, de forma independiente.'
        pregunta: '¿Qué probabilidad hay de que la distancia al cuadrado supere 5?'
        valores: {k: 3}
        region: derecha
        desde: 5
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: suma-cuadrados
        valores:
          k: 3
          m: 0
        fijos: [m]
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: degroot
    capitulo: '8'
publicado: true
---

## Intuición

Un dron intenta posarse sobre una marca en el suelo, y su error de posición en cada uno de los tres ejes es normal con media cero y desviación de un metro, independiente en cada eje. La distancia al cuadrado entre el dron y la marca es la suma de los tres errores al cuadrado. ¿Qué tan grande suele ser? Esa suma de cuadrados de normales estándar es la distribución chi-cuadrada con tres grados de libertad.

Elevar al cuadrado elimina los signos: ya no importa si el error fue hacia un lado o hacia el otro, solo su magnitud. Por eso la chi-cuadrada vive en los positivos. Cada sumando aporta en promedio 1, así que la media es el número de sumandos, los grados de libertad. Con pocos grados la distribución está pegada al cero y es muy asimétrica; con muchos se parece a una normal.

La chi-cuadrada es una de las distribuciones más usadas en estadística porque las sumas de cuadrados aparecen por todas partes: en la varianza muestral, en la comparación entre frecuencias observadas y esperadas y en la bondad de ajuste de modelos. Los grados de libertad cuentan cuántos sumandos independientes entran en la suma.

## Definición

:::definicion[Distribución chi-cuadrada]
Si $Z_1, \dots, Z_k$ son normales estándar independientes, la variable $Q = Z_1^{2} + \dots + Z_k^{2}$ tiene **distribución chi-cuadrada con $k$ grados de libertad**, $Q \sim \chi^{2}_{k}$, con densidad
$$
f(q) = \frac{1}{2^{k/2}\,\Gamma(k/2)}\, q^{k/2 - 1} e^{-q/2}, \qquad q > 0.
$$
:::

Es el caso $\operatorname{Gamma}(k/2, 1/2)$ de la familia gamma. La definición por la densidad permite grados de libertad no enteros.

:::nota[Qué es X]
$X$ = el estadístico $\chi^{2}$ de una prueba de independencia, de bondad de ajuste o de varianza; nunca es negativo.
:::

:::nota[Qué hace cada parámetro]
- **$k$, grados de libertad:** cuántas normales estándar al cuadrado se suman; en una tabla de contingencia, $k = (\text{filas} - 1)(\text{columnas} - 1)$. Si aumenta, el pico se corre a la derecha y el sesgo disminuye.
:::

:::nota[Qué significa cada símbolo]
- $Q$: suma de cuadrados.
- $Z_i$: normales estándar independientes.
- $k$: grados de libertad, el número de sumandos.
- $\Gamma$: función gamma.
- $q$: valor de la suma, positivo.
- $\chi^{2}_{k}$: notación de la distribución.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad $\chi^{2}_{k}$, la región elegida y su probabilidad; los casos cargan 1, 3 y 12 grados de libertad, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge eleva al cuadrado normales estándar, una por una, y suma los cuadrados.

Con un grado la masa se pega al cero. Con 3 la media es 3 y la moda 1. Con 12 la forma es casi simétrica y la desviación es $\sqrt{24} \approx 4.9$; el botón de simulación muestra que la varianza de las muestras ronda $2k$.

## Ejemplo

El error de aterrizaje del dron en cada eje es $\mathcal{N}(0, 1)$ metros, independiente. Sea $D^{2}$ la distancia al cuadrado a la marca, $D^{2} \sim \chi^{2}_{3}$.

1. Distancia cuadrada media: $\mathbb{E}[D^{2}] = 3$, varianza $2 \cdot 3 = 6$.
2. Probabilidad de quedar a más de $\sqrt{5} \approx 2.24$ m: $P(D^{2} > 5) \approx 0.172$.
3. Radio que contiene el 95 % de los aterrizajes: el cuantil 0.95 de $\chi^{2}_{3}$ es 7.81, así que el radio es $\sqrt{7.81} \approx 2.80$ m.
4. Con solo dos ejes, en un plano, la distancia cuadrada sería $\chi^{2}_{2}$, que es una exponencial con media 2.

:::figura[χ² con 3 grados de libertad: el área sombreada de 5 en adelante vale 0.172; el cuantil 0.95 es 7.81.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 3
dominio: [0, 30]
ejemplo:
  titulo: 'Aterrizaje del dron'
  contexto: 'El error de aterrizaje de un dron es normal estándar en cada uno de tres ejes, de forma independiente.'
  pregunta: '¿Qué probabilidad hay de que la distancia al cuadrado supere 5?'
  valores: {k: 3}
  region: derecha
  desde: 5
region: derecha
desde: 5
muestras: false
```
:::

Segundo ejemplo, prueba de independencia. Bajo la hipótesis de que no hay relación entre las variables de la tabla, el estadístico sigue una $\chi^{2}_{5}$, con media 5 y varianza 10.

1. La pregunta es $P(\chi^{2}_{5} > 11.07)$.
2. Como 11.07 es el cuantil 0.95 de $\chi^{2}_{5}$, la probabilidad es 0.05.
3. Ese es el nivel de la prueba: si no hay relación, en el 5 % de las muestras se declararía una por error.

:::figura[Prueba de independencia: el área a la derecha de 11.07 vale 0.05. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 5
dominio: [0, 30]
ejemplo:
  titulo: 'Prueba de independencia'
  contexto: 'Una prueba de independencia con 5 grados de libertad usa 11.07 como valor crítico al 5 %.'
  pregunta: '¿Qué probabilidad hay de obtener un estadístico mayor que 11.07 si no hay relación?'
  valores: {k: 5}
  region: derecha
  desde: 11.07
region: derecha
desde: 11.07
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[Q] = k$ y $\operatorname{Var}(Q) = 2k$.
- **Moda:** $k - 2$ si $k \ge 2$; con $k = 1$ la densidad es infinita en el cero.
- **Suma:** $\chi^{2}_{k_1} + \chi^{2}_{k_2} = \chi^{2}_{k_1 + k_2}$ para sumandos independientes.
- **Caso k = 2:** $\chi^{2}_{2} = \operatorname{Exp}(1/2)$.
- **Varianza muestral:** si $X_1, \dots, X_n$ son $\mathcal{N}(\mu, \sigma^{2})$ independientes, $(n - 1)S^{2}/\sigma^{2} \sim \chi^{2}_{n-1}$; se pierde un grado de libertad al estimar la media.
- **Límite normal:** para $k$ grande, $Q \approx \mathcal{N}(k, 2k)$.

:::figura[Casos con contexto (un grado, error del dron, doce sumandos, tabla chica, análisis mediano): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 3
dominio: [0, 30]
casos:
  - nombre: 'Un grado'
    descripcion: 'El cuadrado de una sola normal: casi siempre pequeño, con densidad infinita en cero.'
    valores: {k: 1}
  - nombre: 'Error del dron'
    descripcion: 'Tres ejes de error al cuadrado: media 3 y moda 1, con cola a la derecha.'
    valores: {k: 3}
  - nombre: 'Doce sumandos'
    descripcion: 'Con 12 grados la suma ya se parece a una normal de media 12 y varianza 24.'
    valores: {k: 12}
  - nombre: 'Tabla chica'
    descripcion: 'k = 2: sesgo fuerte; tablas de contingencia chicas o ajustes con pocas categorías.'
    valores: {k: 2}
  - nombre: 'Análisis mediano'
    descripcion: 'k = 5: sesgo moderado; análisis categóricos de tamaño mediano.'
    valores: {k: 5}
```
:::

:::figura[Un grado de libertad: el cuadrado de una sola normal estándar acumula mucha masa cerca de cero; la densidad es infinita en q = 0.]{componente="ContinuousGenesis"}
```yaml
proceso: suma-cuadrados
valores:
  k: 1
  m: 0
fijos: [m]
```
:::

:::figura[Con 12 grados de libertad la forma se acerca a la normal de media 12 y varianza 24 (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 12
dominio: [0, 35]
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 12
    sigma: 4.9
  etiqueta: Normal de media 12 y varianza 24
```
:::

## Errores comunes

- **Contar mal los grados de libertad.** En la varianza muestral son $n - 1$, no $n$, porque las desviaciones respecto a $\bar{X}$ suman cero y no son libres.
- **Usarla sin estandarizar.** La suma de cuadrados de normales con varianza $\sigma^{2}$ es $\sigma^{2}$ veces una chi-cuadrada.
- **Olvidar que debe haber media cero.** Si las normales tienen media distinta de cero, la suma de cuadrados es una chi-cuadrada no central.
- **Esperar simetría con pocos grados.** Con $k$ pequeño la cola derecha es larga y la media supera a la mediana.

:::figura[Normales con media 1 en lugar de 0: la suma de cuadrados se desplaza a la derecha de la chi-cuadrada central (línea punteada) y deja de ser χ².]{componente="ContinuousGenesis"}
```yaml
proceso: suma-cuadrados
valores:
  k: 3
  m: 1
comparar: true
```
:::

## Conexiones

La chi-cuadrada se construye con cuadrados de la [[normal-estandar-y-puntuacion-z|normal estándar]] y es un caso de la [[distribucion-gamma]]. Dividir una normal estándar entre la raíz de una chi-cuadrada sobre sus grados da la [[distribucion-t-de-student]]; el cociente de dos chi-cuadradas, cada una entre sus grados, da la [[distribucion-f-de-snedecor]]. Si las normales no tienen media cero aparece la [[distribucion-chi-cuadrada-no-central]]. La raíz de una $\chi^{2}_{2}$ con escala es la [[distribucion-de-rayleigh]]. Como gamma tiene forma $k/2$ y escala 2, y las figuras siguientes muestran esa coincidencia y el cociente que produce la F. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas conexiones con las demás distribuciones y explica cómo leer sus gráficas.

:::figura[Chi-cuadrada dentro de la gamma: la chi-cuadrada con k grados (curva) coincide con la gamma de forma k/2 y tasa 1/2 (línea punteada); con k = 6 es la gamma de forma 3.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 6
dominio: [0, 30]
muestras: false
referencia:
  distribucion: gamma
  valores:
    beta: 0.5
  enlace:
    alpha: {de: [k], factor: 0.5}
  etiqueta: Gamma de forma k/2 y escala 2
  visible: true
```
:::

:::figura[Chi-cuadrada y F: en cada experimento se divide una chi-cuadrada con 5 grados entre 5 y otra con 20 grados entre 20; el cociente sigue la F con 5 y 20 grados.]{componente="ContinuousGenesis"}
```yaml
proceso: cociente-f
valores:
  d1: 5
  d2: 20
```
:::

## Formulario

:::formula[Construcción]
$$
Q = \sum_{i=1}^{k} Z_i^{2}, \qquad Z_i \sim \mathcal{N}(0, 1)\ \text{independientes}
$$

- $k$: grados de libertad.
:::

:::formula[Densidad]
$$
f(q) = \frac{1}{2^{k/2}\,\Gamma(k/2)}\, q^{k/2 - 1} e^{-q/2}, \qquad q > 0
$$

- $\Gamma$: función gamma.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[Q] = k, \qquad \operatorname{Var}(Q) = 2k
$$

- Cada sumando aporta media 1 y varianza 2.
:::

:::formula[Varianza muestral]
$$
\frac{(n - 1)S^{2}}{\sigma^{2}} \sim \chi^{2}_{n - 1}
$$

- $n$: tamaño de la muestra normal.
- $S^{2}$: varianza muestral.
- $\sigma^{2}$: varianza de la población.
:::
