---
id: distribucion-t-no-central
titulo: Distribución t no central
titulo_en: Noncentral t distribution
alias:
  - t no central
  - t de Student no central
modulo: 2
submodulo: '2.2'
orden: 29
nivel: avanzado
prerrequisitos:
  - distribucion-t-de-student
relaciones:
  - tipo: generaliza
    id: distribucion-t-de-student
  - tipo: relacionado
    id: distribucion-chi-cuadrada-no-central
etiquetas:
  - potencia de pruebas
  - tamaño de efecto
  - no centralidad
  - tamaño de muestra
resumen: >
  Es el cociente entre una normal con media μ y la raíz de una chi-cuadrada sobre sus grados. Describe el
  estadístico t cuando la hipótesis nula es falsa y sirve para calcular la potencia de las pruebas t.
formula: 'T = \frac{Z + \mu}{\sqrt{V/\nu}} \sim t_{\nu}(\mu)'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: t-no-central
      valores:
        nu: 9
        mu: 2
      dominio: [-5, 12]
      casos:
        - nombre: 'Sin efecto'
          descripcion: 'μ = 0: la t central; el estadístico bajo la hipótesis nula.'
          valores: {nu: 9, mu: 0}
        - nombre: 'Efecto moderado'
          descripcion: 'μ = 2: el estadístico se desplaza a la derecha y queda ligeramente sesgado a la derecha.'
          valores: {nu: 9, mu: 2}
        - nombre: 'Efecto grande'
          descripcion: 'μ = 4: casi siempre supera el valor crítico; la cola derecha es más larga que la izquierda.'
          valores: {nu: 9, mu: 4}
      ejemplo:
        titulo: 'Potencia de una prueba t'
        contexto: 'Una prueba t de una cola con 10 datos (9 grados) rechaza al 5 % si T supera 1.833. El efecto real hace que T siga una t no central con μ = 2.'
        pregunta: '¿Qué probabilidad tiene la prueba de detectar el efecto?'
        valores: {nu: 9, mu: 2}
        region: derecha
        desde: 1.833
      referencia:
        distribucion: t
        valores: {nu: 9}
        etiqueta: 't central, bajo la nula'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: cociente-t
        valores:
          nu: 9
          mu: 2
referencias:
  - clave: casella-berger
  - clave: montgomery-doe
publicado: true
---

## Intuición

Antes de un ensayo clínico hay que decidir cuántos pacientes reclutar. Si el tratamiento tiene un efecto real, el estadístico t de la prueba no sigue la t de Student centrada en cero, sino una versión desplazada: el numerador ya no es una normal con media cero, sino una normal con media proporcional al efecto y a la raíz del tamaño de muestra. Esa versión desplazada es la t no central.

La potencia de la prueba, la probabilidad de detectar el efecto, es la probabilidad de que esa t no central supere el valor crítico. Con pocos pacientes el desplazamiento es pequeño y la prueba falla a menudo; con más pacientes el desplazamiento crece y la potencia se acerca a uno.

La t no central no es simplemente una t corrida: como el denominador aleatorio multiplica también al desplazamiento, la distribución se vuelve asimétrica hacia el lado del efecto. Por eso su cálculo exacto requiere métodos numéricos, aunque su construcción es tan simple como la de la t ordinaria.

## Definición

:::definicion[Distribución t no central]
Sean $Z \sim \mathcal{N}(0, 1)$ y $V \sim \chi^{2}_{\nu}$ independientes y $\mu \in \mathbb{R}$. La variable
$$
T = \frac{Z + \mu}{\sqrt{V/\nu}}
$$
tiene **distribución t no central** con $\nu$ grados de libertad y no centralidad $\mu$, $T \sim t_{\nu}(\mu)$.
:::

En una prueba t de una muestra con $n$ datos, efecto $\Delta$ y desviación $\sigma$, el estadístico sigue $t_{n-1}(\mu)$ con $\mu = \sqrt{n}\,\Delta/\sigma$.

:::nota[Qué representa la variable]
$T$ = el estadístico $t$ de una prueba cuando la hipótesis nula es falsa.
:::

:::nota[Qué hace cada parámetro]
- **$\nu$, grados de libertad:** la información de la muestra, $n - 1$ en una prueba de una muestra. Si aumenta, las colas se adelgazan y la curva se acerca a una normal desplazada.
- **$\mu$, no centralidad:** el efecto estandarizado multiplicado por $\sqrt{n}$. Si aumenta, la curva se corre a la derecha, se vuelve asimétrica y la potencia sube.
:::

:::nota[Qué significa cada símbolo]
- $T$: estadístico t.
- $Z$: normal estándar; $V$: chi-cuadrada independiente.
- $\nu$: grados de libertad.
- $\mu$: no centralidad, el desplazamiento del numerador.
- $n$: tamaño de muestra; $\Delta$: tamaño del efecto; $\sigma$: desviación de los datos.
- $\Delta/\sigma$: efecto estandarizado.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la t no central junto a la t central (línea punteada), la región elegida y su probabilidad; los casos cargan sin efecto, efecto moderado y efecto grande, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge divide en cada experimento una normal desplazada entre la raíz de una chi-cuadrada sobre sus grados.

La región desde 1.833, el valor crítico de una cola al 5 % con 9 grados, mide la potencia: 0.05 con $\mu = 0$, 0.58 con $\mu = 2$ y 0.98 con $\mu = 4$. Al aumentar $\mu$ se nota la asimetría hacia la derecha.

## Ejemplo

Una prueba t de una cola con 10 datos rechaza al 5 % si $T > 1.833$, el cuantil 0.95 de $t_{9}$. El efecto estandarizado es $\Delta/\sigma = 0.632$, de modo que $\mu = \sqrt{10} \cdot 0.632 \approx 2$.

1. Bajo la alternativa, $T \sim t_{9}(2)$.
2. Potencia: $P(t_{9}(2) > 1.833) \approx 0.58$.
3. La media del estadístico es alrededor de 2.19, un poco más que $\mu$, por el efecto del denominador.
4. Para una potencia de 0.98 se necesita $\mu \approx 4$, lo que con el mismo efecto exige unos 40 datos.

:::figura[Potencia de la prueba t: el área sombreada a la derecha de 1.833 vale 0.58; bajo la t central (línea punteada) vale 0.05. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: t-no-central
valores:
  nu: 9
  mu: 2
dominio: [-5, 12]
ejemplo:
  titulo: 'Potencia de una prueba t'
  contexto: 'Una prueba t de una cola con 9 grados rechaza si T supera 1.833; el efecto real hace que T sea no central con μ = 2.'
  pregunta: '¿Qué probabilidad tiene la prueba de detectar el efecto?'
  valores: {nu: 9, mu: 2}
  region: derecha
  desde: 1.833
region: derecha
desde: 1.833
muestras: false
referencia:
  distribucion: t
  valores:
    nu: 9
  etiqueta: t central
```
:::

## Propiedades

- **Media:** $\mu\sqrt{\nu/2}\,\frac{\Gamma((\nu - 1)/2)}{\Gamma(\nu/2)}$ si $\nu > 1$, algo mayor que $\mu$ en valor absoluto.
- **Varianza:** $\frac{\nu(1 + \mu^{2})}{\nu - 2} - \mathbb{E}[T]^{2}$ si $\nu > 2$.
- **Caso μ = 0:** la t de Student central.
- **Asimetría:** con $\mu > 0$ la cola derecha es más larga; con $\mu < 0$, la izquierda.
- **Límite:** cuando $\nu \to \infty$, $T \to \mathcal{N}(\mu, 1)$.
- **Potencia creciente:** para un valor crítico fijo, $P(T > c)$ crece con $\mu$, y $\mu$ crece como $\sqrt{n}$.

:::figura[Tres casos con contexto (sin efecto, efecto moderado y efecto grande): cada botón carga la no centralidad y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: t-no-central
valores:
  nu: 9
  mu: 2
dominio: [-5, 12]
casos:
  - nombre: 'Sin efecto'
    descripcion: 'μ = 0: la t central.'
    valores: {nu: 9, mu: 0}
  - nombre: 'Efecto moderado'
    descripcion: 'μ = 2: potencia 0.58.'
    valores: {nu: 9, mu: 2}
  - nombre: 'Efecto grande'
    descripcion: 'μ = 4: potencia 0.98 y cola derecha alargada.'
    valores: {nu: 9, mu: 4}
region: derecha
desde: 1.833
muestras: false
```
:::

:::figura[Construcción: una normal desplazada a 2 dividida entre la raíz de una chi-cuadrada sobre 9; la normal del numerador es la línea punteada.]{componente="ContinuousGenesis"}
```yaml
proceso: cociente-t
valores:
  nu: 9
  mu: 2
```
:::

## Errores comunes

- **Calcular la potencia con la normal.** Con pocos datos, usar $\mathcal{N}(\mu, 1)$ con su propio valor crítico, 1.645, en lugar de la t no central con el valor crítico de la t sobreestima la potencia: con 4 grados y $\mu = 2$ da 0.639 en lugar de 0.504.
- **Desplazar la t central.** $t_{\nu} + \mu$ no es la t no central; la t no central es asimétrica.
- **Confundir μ con el tamaño del efecto.** La no centralidad es el efecto estandarizado multiplicado por $\sqrt{n}$.
- **Usar el valor crítico de la no central.** El valor crítico viene de la t central bajo la nula.

:::figura[Normal frente a t no central con 4 grados y μ = 2: con el mismo corte, 2.132, la t no central da potencia 0.504 y la normal de media 2 (línea punteada) 0.447. La aproximación normal se vuelve optimista cuando usa su propio corte, 1.645, y da 0.639.]{componente="DistributionExplorer"}
```yaml
distribucion: t-no-central
valores:
  nu: 4
  mu: 2
dominio: [-5, 12]
region: derecha
desde: 2.132
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 2
    sigma: 1
  etiqueta: Normal de media 2
```
:::

## Conexiones

La t no central generaliza la [[distribucion-t-de-student]] así como la [[distribucion-chi-cuadrada-no-central]] generaliza la chi-cuadrada. Con infinitos grados se vuelve una [[distribucion-normal]] desplazada. Es la herramienta para calcular tamaños de muestra y potencia de las pruebas t y para construir intervalos de confianza del tamaño del efecto. El [[mapa-de-relaciones-entre-distribuciones]] la sitúa entre las demás distribuciones.

## Formulario

:::formula[Construcción]
$$
T = \frac{Z + \mu}{\sqrt{V/\nu}}, \qquad Z \sim \mathcal{N}(0, 1),\ V \sim \chi^{2}_{\nu}
$$

- $\mu$: no centralidad; $\nu$: grados de libertad.
:::

:::formula[No centralidad en una prueba t]
$$
\mu = \sqrt{n}\,\frac{\Delta}{\sigma}
$$

- $n$: tamaño de muestra.
- $\Delta/\sigma$: efecto estandarizado.
:::

:::formula[Media]
$$
\mathbb{E}[T] = \mu\sqrt{\frac{\nu}{2}}\,\frac{\Gamma\!\left(\frac{\nu - 1}{2}\right)}{\Gamma\!\left(\frac{\nu}{2}\right)}, \qquad \nu > 1
$$

- $\Gamma$: función gamma.
:::

:::formula[Potencia]
$$
\text{potencia} = P\big(t_{\nu}(\mu) > t_{\nu;\,1 - \alpha}\big)
$$

- $t_{\nu;\,1-\alpha}$: valor crítico de la t central.
:::
